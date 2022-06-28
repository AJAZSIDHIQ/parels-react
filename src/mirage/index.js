import { createServer } from "miragejs";

export function makeServer({ environment = "test" }) {
  return createServer({
    environment,

    factories: {

    },

    models: {
    },
    seeds(server) {
    },

    routes() {
       // this.namespace = "api"

        this.get("/users", () => ({
            users: [
              { id: 1, name: "alice" },
              { id: 2, text: "bob" },
            ],
          }))

        this.post("/api/v1/auth/login/mobile",  (schema, request)   => ({
          //let attrs = JSON.parse(request.requestBody)   
        }))

        this.post("/api/v1/auth/login/mobile/validate",  (schema, request)   => {
          //let attrs = JSON.parse(request.requestBody)   
          return {
            "token": "fghui656789",
            "refreshToken": "fghui656789"
          }
        })
    },


  });
}