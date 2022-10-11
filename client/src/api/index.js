import axios from "axios";

const token = JSON.parse(localStorage.getItem("user"));

// buat konfigurasi sehingga axios dapat mengirimkan token pada headers
const authAxios = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        Refresh_Token: token?.refresh_token,
        Content_Type: "multipart/form-data",
    },
});

export default authAxios;
