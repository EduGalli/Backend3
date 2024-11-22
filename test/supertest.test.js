import supertest from "supertest";
import * as chai from "chai";
import config from "../src/config/config.js";

const PORT = config.app.PORT || 8080;
const expect = chai.expect;
const requester = supertest(`http://localhost:${PORT}`);

describe("Testing de la App Web Adoptame", () => {
    let cookie;

    describe("Mascotas", () => {
        it("Debería crear una mascota correctamente (POST /api/pets)", async () => {
            const ramboMock = { name: "Rambo", specie: "Pichicho", birthDate: "2021-03-10" };
            const { statusCode, _body } = await requester.post("/api/pets").send(ramboMock);

            expect(statusCode).to.equal(200);
            expect(_body.payload).to.have.property("_id");
        });

        it("Debería tener `adopted: false` al crear mascota con datos mínimos", async () => {
            const mascotaMock = { name: "Roger", specie: "Perro", birthDate: "2016-01-08" };
            const { statusCode, _body } = await requester.post("/api/pets").send(mascotaMock);

            expect(statusCode).to.equal(200);
            expect(_body.payload).to.have.property("adopted", false);
        });

        it("Debería responder con status 400 al crear mascota sin nombre", async () => {
            const mascotaMock = { specie: "Gato", birthDate: "2023-05-15" };
            const { statusCode } = await requester.post("/api/pets").send(mascotaMock);

            expect(statusCode).to.equal(400);
        });

        it("Debería obtener mascotas con campos `status` y `payload` (GET /api/pets)", async () => {
            const { statusCode, _body } = await requester.get("/api/pets");

            expect(statusCode).to.equal(200);
            expect(_body).to.have.property("status", "success");
            expect(_body.payload).to.be.an("array");
        });

        it("Debería borrar la última mascota agregada (DELETE /api/pets/:id)", async () => {
            const mascotaMock = { name: "Para borrar", specie: "Perro", birthDate: "2023-02-20" };
            const { _body: { payload } } = await requester.post("/api/pets").send(mascotaMock);

            const { statusCode } = await requester.delete(`/api/pets/${payload._id}`);
            expect(statusCode).to.equal(200);
        });
    });

    describe("Usuarios", () => {
        it("Debería registrar un usuario correctamente (POST /api/sessions/register)", async () => {
            const usuarioMock = { first_name: "Edu", last_name: "Galli", email: "edu@correofalso.com", password: "1234" };
            const { statusCode, _body } = await requester.post("/api/sessions/register").send(usuarioMock);

            expect(statusCode).to.equal(201);
            expect(_body.payload).to.have.property("_id");
        });

        it("Debería loguear y recuperar cookie (POST /api/sessions/login)", async () => {
            const usuarioMock = { email: "edu@correofalso.com", password: "1234" };
            const { headers, statusCode } = await requester.post("/api/sessions/login").send(usuarioMock);

            expect(statusCode).to.equal(200);
            const cookieResultado = headers["set-cookie"][0];
            expect(cookieResultado).to.be.ok;

            const [name, value] = cookieResultado.split(";")[0].split("=");
            cookie = { name, value };

            expect(cookie.name).to.equal("coderCookie");
            expect(cookie.value).to.be.ok;
        });

        it("Debería obtener usuario actual con la cookie (GET /api/sessions/current)", async () => {
            const { statusCode, _body } = await requester
                .get("/api/sessions/current")
                .set("Cookie", `${cookie.name}=${cookie.value}`);

            expect(statusCode).to.equal(200);
            expect(_body.payload).to.have.property("email", "edu@correofalso.com");
        });
    });

    describe("Adopciones", () => {
        it("Debería registrar una adopción correctamente", async () => {
            const mascotaMock = { name: "Bambi", specie: "Perro", birthDate: "2020-06-15" };
            const { _body: petBody } = await requester.post("/api/pets").send(mascotaMock);

            const usuarioMock = { first_name: "Yayo", last_name: "Caceres", email: "yayo@hablemossinsaber.com", password: "1234" };
            const { _body: userBody } = await requester.post("/api/sessions/register").send(usuarioMock);

            const adopcionMock = { uid: userBody.payload._id, pid: petBody.payload._id, adoptionDate: "2024-11-21" };
            const { statusCode, _body } = await requester.post(`/api/adoptions`).send(adopcionMock);

            expect(statusCode).to.equal(200);
            expect(_body).to.have.property("status", "success");
            expect(_body).to.have.property("message", "Pet adopted");
        });

        it("Debería obtener adopciones con `status` y `payload` como array (GET /api/adoptions)", async () => {
            const { statusCode, _body } = await requester.get("/api/adoptions");

            expect(statusCode).to.equal(200);
            expect(_body).to.have.property("status", "success");
            expect(_body.payload).to.be.an("array");
        });
    });
});