import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../config/swagger.js";
import router from "../routes/index.js";

const app = express();
const swaggerUiOptions = {
    customJs: '/swagger-auth.js',
};

app.use(cors());
app.use(express.json());


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

app.get("/swagger-auth.js", (req, res) => {
    res.type("application/javascript");
    res.send(`
        window.addEventListener('load', function() {
            setTimeout(function() {
                // Cria o modal
                const modal = document.createElement('div');
                modal.id = 'auth-modal';
                modal.style.cssText = \`
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(0,0,0,0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                \`;

                modal.innerHTML = \`
                    <div style="background:#1f1f1f; padding:40px; border-radius:8px; width:350px; font-family:sans-serif;">
                        <h2 style="color:#fff; margin-bottom:24px;"> Order API Login</h2>
                        
                        <label style="color:#ccc; font-size:13px;">Email</label>
                        <input id="auth-email" type="email" value="admin@admin"
                            style="width:100%; padding:10px; margin:6px 0 16px; border-radius:4px; border:1px solid #444; background:#2d2d2d; color:#fff; box-sizing:border-box;" />
                        
                        <label style="color:#ccc; font-size:13px;">Senha</label>
                        <input id="auth-password" type="password" value="123"
                            style="width:100%; padding:10px; margin:6px 0 24px; border-radius:4px; border:1px solid #444; background:#2d2d2d; color:#fff; box-sizing:border-box;" />
                        
                        <button id="auth-btn"
                            style="width:100%; padding:12px; background:#49cc90; color:#000; font-weight:bold; border:none; border-radius:4px; cursor:pointer; font-size:15px;">
                            Entrar
                        </button>

                        <p id="auth-error" style="color:#f93e3e; margin-top:12px; font-size:13px; display:none;"></p>
                        
                        <p style="color:#666; font-size:12px; margin-top:16px; text-align:center;">
                        </p>
                    </div>
                \`;

                document.body.appendChild(modal);

                // Evento do botão
                document.getElementById('auth-btn').addEventListener('click', async function() {
                    const email = document.getElementById('auth-email').value;
                    const password = document.getElementById('auth-password').value;
                    const errorEl = document.getElementById('auth-error');
                    const btn = document.getElementById('auth-btn');

                    btn.textContent = 'Entrando...';
                    btn.disabled = true;

                    try {
                        const response = await fetch('/auth/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, password })
                        });

                        const data = await response.json();

                        if (!response.ok) {
                            throw new Error(data.message || 'Erro ao fazer login');
                        }

                        // Seta o token automaticamente no Swagger
                        window.ui.preauthorizeApiKey('bearerAuth', data.token);

                        // Fecha o modal
                        document.getElementById('auth-modal').remove();

                    } catch (err) {
                        errorEl.textContent = err.message;
                        errorEl.style.display = 'block';
                        btn.textContent = 'Entrar';
                        btn.disabled = false;
                    }
                });

            }, 100);
        });
    `);
});


app.use(router);

export default app;