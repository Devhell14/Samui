const sql = require('../config/database');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// ฟังก์ชันสำหรับตรวจสอบ API Key
const checkApiKey = (req, res) => {
    if (req.headers['key'] !== process.env.API_KEY) {
        res.status(401).send({ "status": "FAILED", "message": "Unauthorized: Invalid API KEY." });
        return false;
    }
    return true;
};

// ฟังก์ชันสำหรับสอบถามข้อมูลจากฐานข้อมูล
const queryDatabase = async (query, params) => {
    try {
        const request = new sql.Request();
        params.forEach((param, index) => {
            request.input(`param${index}`, param);
        });
        const result = await request.query(query);
        return result.recordset;
    } catch (err) {
        console.log(err);
        throw new Error("An Error Occurred While Querying The Database.");
    }
};

// เส้นทางสำหรับการล็อกอิน
router.post('/login', async (req, res) => {
    if (!checkApiKey(req, res)) return;

    const { username, password, company } = req.body;
    const tokenExpiry = '24h'; // ระยะเวลาหมดอายุของ token

    if (!username || !password || !company) {
        return res.send({ "status": "FAILED", "message": "Username or Password cannot be empty" });
    }

    // การสอบถามข้อมูลจากฐานข้อมูล
    const query = "SELECT * FROM API_0001_LOGIN WHERE Emp_UUser=@param0 AND Comp_Id=@param1  AND Emp_Status='Y'";

    try {
        const result = await queryDatabase(query, [username, company]);

        if (result.length === 0) {
            return res.send({ "status": "FAILED", "message": "Invalid username or password" });
        }

        const storedPassword = result[0].Emp_PPass;

        // ตรวจสอบรหัสผ่าน
        if (password === storedPassword) {
            // สร้าง token โดยใส่ข้อมูลทั้งหมดใน payload
            const token = jwt.sign(result[0], process.env.API_KEY, { expiresIn: tokenExpiry });
            return res.send({ "status": "OK", "message": "Login Success", "token": token });
        } else {
            console.log("Invalid password for username:", username);
            return res.send({ "status": "FAILED", "message": "Invalid username or password" });
        }
    } catch (err) {
        console.log("Database query error:", err);
        return res.send({ "status": "FAILED", "message": "Database query error" });
    }
});

// เส้นทางสำหรับการตรวจสอบ token
router.post('/authen', (req, res) => {
    if (!checkApiKey(req, res)) return;

    try {
        const token = req.headers.authorization.split(' ')[1]; // แยก token จาก header
        const decoded = jwt.verify(token, process.env.API_KEY);
        res.send({ "status": "OK", "message": "Authen Success", "decoded": decoded });
    } catch (err) {
        res.send({ "status": "FAILED", "message": "Authen Failed" });
    }
});

module.exports = router;