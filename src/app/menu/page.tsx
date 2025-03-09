"use client";

import React, { useState } from "react";
import { Layout, Menu, Avatar, Typography, Spin, Button } from "antd";
import {
  FormOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface MenuLayoutProps {
  children: React.ReactNode;
}

const MenuLayout: React.FC<MenuLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);

        setTimeout(() => {
          Swal.fire({
            title: "Sesión cerrada",
            text: "Has cerrado sesión correctamente.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            router.push("/");
          });
        }, 1000);
      }
    });
  };

  const handleMenuClick = (e: any) => {
    if (e.key === "forms") {
      setContentLoading(true);
      setTimeout(() => setContentLoading(false), 1000);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          backgroundColor: "#ffffff",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
          zIndex: 10,
        }}
        width={240}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
            height: "64px",
            borderBottom: "1px solid #e8e8e8",
          }}
        >
          {!collapsed && (
            <Title level={4} style={{ margin: 0, color: "#000000" }}>
              Prueba Tenica
            </Title>
          )}
          <Avatar
            style={{
              backgroundColor: "#ffffff",
              color: "#000",
              border: "1px solid #ccc",
            }}
          >
            MA
          </Avatar>
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{ cursor: "pointer" }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        </div>

        <Menu
          mode="inline"
          defaultSelectedKeys={["forms"]}
          style={{ border: "none", paddingTop: "16px" }}
          onClick={handleMenuClick}
        >
          <Menu.Item
            key="forms"
            icon={<FormOutlined style={{ color: "#000" }} />}
          >
            <Link href="/auth/form">Formularios</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 16px",
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            height: "64px",
            position: "sticky",
            top: 0,
            zIndex: 9,
          }}
        >
          <Button
            type="text"
            onClick={handleLogout}
            icon={<LogoutOutlined style={{ color: "#ff4d4f" }} />}
          >
            {loading ? <Spin size="small" /> : "Cerrar sesión"}
          </Button>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {contentLoading ? <Spin size="large" /> : children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MenuLayout;
