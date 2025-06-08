// Router Import
import { Router } from "express";

// Utils Import
import { generateUserId } from "../utils/idGenerator.util.js";
import {
	hashPassword,
	comparePasswords,
	signToken,
} from "../utils/verifier.util.js";

// Middleware Import
import { validateRegister } from "../middlewares/auth.validator.js";
import { validateBody } from "../middlewares/body.validator.js";

// Controllers Import
import { registerUser, getUser } from "../controllers/auth.controllers.js";

// Config
const router = Router();

// ----- GET logout user -----
// Loggar ut användaren
router.get("/logout", async (req, res) => {
	// Kontroll ifall det finns en cookie med en token i sig
	const token = req.cookies.userToken;
	console.log(token);

	if (token) {
		res.clearCookie("userToken", {
			httpOnly: true,
			sameSite: "Strict",
			secure: false,
		});

		res.json({
			success: true,
			message: "User logged out",
		});
	} else {
		res.status(400).json({
			success: false,
			message: "No user to log out",
		});
	}
});

// ---------- SKA UPPDATERAS ----------
// ----- POST register new user -----
// Registrerar en ny användare
router.post("/register", validateBody, validateRegister, async (req, res) => {
	const { username, password, role } = req.body;

	const hashedPassword = await hashPassword(password);

	// Mongoose använder model/schema för att kontrollera så uppgifterna stämmer.
	// Skapar därefter den nya användaren ifall allt stämmer.
	const result = await registerUser({
		username: username,
		password: hashedPassword,
		role: role,
		userId: generateUserId(),
	});

	// Om Mongoose returnerar en godkänd ny användare.
	if (result) {
		res.status(201).json({
			success: true,
			message: "User created successfully",
		});
	} else {
		res.status(400).json({
			success: false,
			message: "Registration unsuccessful",
		});
	}
});

// ----- POST login user -----
// Loggar in en användare
router.post("/login", validateBody, async (req, res) => {
	// Kontroll ifall en användare redan är inloggad
	const token = req.cookies.userToken;
	if (!token) {
		const { username, password } = req.body;
		const user = await getUser(username);

		if (user) {
			const correctPassword = await comparePasswords(
				password,
				user.password
			);

			if (correctPassword) {
				const token = signToken({ userId: user.userId });
				res.cookie("userToken", token, {
					httpOnly: true,
					secure: false,
					sameSite: "Strict",
					maxAge: 60 * 60 * 1000, // En timme
				});
				res.json({
					success: true,
					message: "User logged in successfully",
					token: `Bearer ${token}`,
				});
			} else {
				res.status(400).json({
					success: false,
					message: "Username and/or password are incorrect./password",
				});
			}
		} else {
			res.status(400).json({
				success: false,
				message: "Username and/or password are incorrect./user",
			});
		}
	} else {
		res.status(400).json({
			success: false,
			message: "User is already logged in",
		});
	}
});

// Middleware

// Export
export default router;
