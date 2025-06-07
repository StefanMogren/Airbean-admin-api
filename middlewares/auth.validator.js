export function validateAuthBody(req, res, next) {
    // Kontroll ifall det ens finns en body
    if (req.body) {
        const { username, password } = req.body;

        // Kontroll ifall det ens finns något i "username" och "password"
        if (username && password) {
            // Kontroll ifall "username" är 6 tecken eller längre
            if (username.length >= 6) {
                // Sista kontroll ifall "password" är 8 tecken eller längre.
                if (password.length >= 8) {
                    next();
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
                message: "Both username AND password are required.",
            });
        }
    } else {
        res.status(400).json({
            success: false,
            message: "No body found in request.",
        });
    }
}
