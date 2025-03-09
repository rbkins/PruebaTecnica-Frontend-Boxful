"use client";

import React, { useState } from "react";
import { Card, Form, Input, Button, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const { Title, Text } = Typography;

interface RegisterFormValues {
  email: string;
  password: string;
  confirm: string;
}

export default function RegistroPage() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values: RegisterFormValues) => {
    try {
      setLoading(true);

      const { email, password } = values;

      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en el registro");
      }

      Swal.fire({
        title: "¡Registro exitoso!",
        text: "Ya puedes iniciar sesión.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/");
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        Swal.fire({
          title: "Error",
          text: error.message || "Error al registrar la cuenta.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Error al registrar la cuenta.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
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
        padding: "16px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "520px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
        variant="borderless"
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={2} style={{ margin: "0 0 8px 0" }}>
            Crear una cuenta
          </Title>
        </div>

        <Form
          form={form}
          name="registro_form"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          scrollToFirstError
        >
          <Form.Item
            name="email"
            label="Correo electrónico"
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
              prefix={<MailOutlined />}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            rules={[
              { required: true, message: "Por favor ingresa tu contraseña" },
              {
                min: 8,
                message: "La contraseña debe tener al menos 8 caracteres",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Contraseña"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirmar contraseña"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Por favor confirma tu contraseña" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Las contraseñas no coinciden")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirmar contraseña"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              loading={loading}
            >
              Registrarme
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <Text type="secondary">
              ¿Ya tienes una cuenta? <Link href="/">Inicia sesión</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
}
