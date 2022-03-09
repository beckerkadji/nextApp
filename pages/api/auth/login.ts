import axios from "axios";
import withSession from "../../../utils/session";

export default withSession(async (req: any, res: any) => {

    const url = `${process.env.URL_AUTH_SERVICE}/api/login`;

    try {
        const data = await axios.post(url, req.body);
        if (data.data.code != 1000) {
            const result = { isLoggedIn: false, data: data.data };
            res.json(result);
            return;
        }

        axios.defaults.headers.common["Authorization"] = data.data.token;
        const user = { isLoggedIn: true, data: data.data };
        req.session.set("user", user);
        await req.session.save();
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});