// Router Import
import { Router } from "express";

// Utils Import
import { generateUserId } from "../utils/idGenerator.util.js";

// Middleware Import
import { validateAuthBody } from "../middlewares/auth.validator.js";
import { validateBody } from "../middlewares/body.validator.js";

// Controllers Import
import { registerUser, getUser } from "../controllers/auth.controllers.js";

// Config
const router = Router();

// ----- GET logout user -----
// Loggar ut användaren
router.get("/logout", async (req, res) => {
	// Kontroll ifall det finns en användare i "global.user"
	if (global.user) {
		global.user = null;

		res.json({
			success: true,
			message: "User logged out successfully",
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
router.post("/register", validateBody, validateAuthBody, async (req, res) => {
	const { username, password, role } = req.body;

	// Mongoose använder model/schema för att kontrollera så uppgifterna stämmer.
	// Skapar därefter den nya användaren ifall allt stämmer.
	const result = await registerUser({
		username: username,
		password: password,
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
router.post("/login", validateBody, validateAuthBody, async (req, res) => {
	// Kontroll ifall en användare redan är inloggad
	if (!global.user) {
		const { username, password } = req.body;
		const user = await getUser(username);

		// Kontroll ifall användaren finns samt att lösenordet stämmer
		if (user && user.password === password) {
			global.user = user;
			res.json({
				success: true,
				message: "User logged in successfully",
			});
		} else {
			res.status(400).json({
				success: false,
				message: "Username and/or password are incorrect.",
			});
		}
	} else {
		res.status(400).json({
			success: false,
			message: "User already logged in.",
		});
	}
});

// Middleware

// Export
export default router;
