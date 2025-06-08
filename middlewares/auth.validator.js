export function validateRegister(req, res, next) {
	// Kontroll ifall det ens finns en body

	const { username, password, role } = req.body;

	// Kontroll ifall det ens finns något i "username" och "password"
	if (username && password && role) {
		// Kontroll ifall "username" är 6 tecken eller längre
		if (username.length >= 6) {
			// Sista kontroll ifall "password" är 8 tecken eller längre.
			if (password.length >= 8) {
				if (role === "user" || role === "admin") {
					next();
				} else {
					res.status(400).json({
						success: false,
						message: "Role must be either user or admin",
					});
				}
			} else {
				res.status(400).json({
					success: false,
					message: "Password must be 8 characters or longer",
				});
			}
		} else {
			res.status(400).json({
				success: false,
				message: "Username must be 6 characters or longer.",
			});
		}
	} else {
		res.status(400).json({
			success: false,
			message: "Both username, password AND role are required.",
		});
	}
}
