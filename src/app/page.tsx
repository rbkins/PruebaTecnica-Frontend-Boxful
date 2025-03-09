"use client";

import React, { useState } from "react";
import { Card, Form, Input, Button, Typography, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Head from "next/head";
const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      setLoginError("");

      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setLoginError("Usuario o contraseña incorrectos");
        } else {
          setLoginError(data.message || "Error en el inicio de sesión");
        }
        throw new Error(data.message || "Error en el inicio de sesión");
      }

      // Guardar el token en localStorage o en cookies
      localStorage.setItem("token", data.access_token);

      Swal.fire({
        title: "¡Inicio de sesión exitoso!",
        text: "Has iniciado sesión correctamente.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/menu");
      });
    } catch (error: any) {
      if (!loginError) {
        setLoginError(error.message || "Error al iniciar sesión");
      }

      Swal.fire({
        title: "Error",
        text: error.message || "Error al iniciar sesión",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f2f5",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
        variant="borderless"
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={2} style={{ margin: "0 0 8px 0" }}>
            Bienvenido
          </Title>
          <Text type="secondary">Inicia sesión para continuar</Text>
        </div>

        {loginError && (
          <Alert
            message="Error de autenticación"
            description={loginError}
            type="error"
            showIcon
            style={{ marginBottom: "16px" }}
            closable
            onClose={() => setLoginError("")}
          />
        )}

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu correo electrónico",
              },
              {
                type: "email",
                message: "Ingresa un correo electrónico válido",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Correo electrónico"
              autoComplete="email"
              status={loginError ? "error" : ""}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Por favor ingresa tu contraseña" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Contraseña"
              autoComplete="current-password"
              status={loginError ? "error" : ""}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              loading={loading}
            >
              Iniciar Sesión
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary">
              ¿No tienes una cuenta?{" "}
              <Link href="/registrar">Regístrate ahora</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
}
