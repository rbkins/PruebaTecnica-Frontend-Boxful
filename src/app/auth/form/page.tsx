"use client";
import React, { useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
  InputNumber,
  Table,
  Space,
  Typography,
  Divider,
  Popconfirm,
  Modal,
} from "antd";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  PushpinOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";

const { Option } = Select;
const { Title } = Typography;

interface Bulto {
  key: number;
  largo: number;
  alto: number;
  ancho: number;
  peso: number;
  contenido: string;
}

const EnvioForm = () => {
  const [form] = Form.useForm();
  const [bultos, setBultos] = useState<Bulto[]>([]);
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] = useState<any>({});
  const [editingBulto, setEditingBulto] = useState<Bulto | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleNextStep = () => {
    form
      .validateFields()
      .then((values) => {
        setFormValues(values);
        setStep(2);
      })
      .catch((err) => {
        console.error("Validation failed:", err);
        Swal.fire({
          title: "Error",
          text: "Por favor, complete todos los campos requeridos.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  const handleAddBulto = (values: any) => {
    const newBulto: Bulto = {
      key: Date.now(),
      largo: values.largo,
      alto: values.alto,
      ancho: values.ancho,
      peso: values.peso,
      contenido: values.contenido,
    };
    setBultos([...bultos, newBulto]);
    form.resetFields(["largo", "alto", "ancho", "peso", "contenido"]);

    Swal.fire({
      title: "¡Bulto agregado!",
      text: "El bulto se ha agregado correctamente.",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const handleRemoveBulto = (key: number) => {
    setBultos(bultos.filter((bulto) => bulto.key !== key));

    Swal.fire({
      title: "¡Bulto eliminado!",
      text: "El bulto se ha eliminado correctamente.",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const handleEditBulto = (bulto: Bulto) => {
    setEditingBulto(bulto);
    setIsModalVisible(true);
  };

  const handleUpdateBulto = (values: any) => {
    const updatedBultos = bultos.map((bulto) =>
      bulto.key === editingBulto?.key ? { ...bulto, ...values } : bulto
    );
    setBultos(updatedBultos);
    setIsModalVisible(false);
    setEditingBulto(null);

    Swal.fire({
      title: "¡Bulto actualizado!",
      text: "El bulto se ha actualizado correctamente.",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const handleSubmit = async () => {
    try {
      if (bultos.length === 0) {
        Swal.fire({
          title: "Error",
          text: "Debe agregar al menos un bulto.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      const payload = {
        ...formValues,
        fechaprogramada: formValues.fechaprogramada?.toISOString(),
        paquetes: bultos.map((bulto) => ({
          largo: bulto.largo,
          alto: bulto.alto,
          ancho: bulto.ancho,
          pesoenlibras: bulto.peso,
          contenido: bulto.contenido,
        })),
      };

      console.log("Payload to be sent:", payload);

      const token = localStorage.getItem("token");
      if (!token) {
        // Mostrar alerta de error si no hay token
        Swal.fire({
          title: "Error",
          text: "No se encontró el token de autenticación.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      const response = await fetch("http://localhost:5000/envios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error response from server:", errorResponse);
        throw new Error(errorResponse.message || "Error al enviar los datos");
      }

      const data = await response.json();
      console.log("Response from API:", data);

      Swal.fire({
        title: "¡Envío creado!",
        text: "El envío se ha creado exitosamente.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        form.resetFields();
        setBultos([]);
        setStep(1);
        setFormValues({});
      });
    } catch (error) {
      console.error("Error:", error);

      if (error instanceof Error) {
        Swal.fire({
          title: "Error",
          text: `Error al enviar los datos: ${error.message}`,
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Error desconocido al enviar los datos.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const columns = [
    {
      title: "Peso en libras",
      dataIndex: "peso",
      key: "peso",
      render: (text: number) => `${text} lb`,
    },
    { title: "Contenido", dataIndex: "contenido", key: "contenido" },
    {
      title: "Largo",
      dataIndex: "largo",
      key: "largo",
      render: (text: number) => `${text} cm`,
    },
    {
      title: "Alto",
      dataIndex: "alto",
      key: "alto",
      render: (text: number) => `${text} cm`,
    },
    {
      title: "Ancho",
      dataIndex: "ancho",
      key: "ancho",
      render: (text: number) => `${text} cm`,
    },
    {
      title: "Acción",
      key: "action",
      render: (_: any, record: Bulto) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditBulto(record)}
          />
          <Popconfirm
            title="¿Seguro que desea eliminar este bulto?"
            onConfirm={() => handleRemoveBulto(record.key)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
      {step === 1 && (
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Dirección de recolección"
                name="direccionrecoleccion"
                rules={[{ required: true, message: "Ingrese la dirección" }]}
              >
                <Input
                  prefix={<EnvironmentOutlined />}
                  placeholder="Colonia Las Magnolias Calle ruta militar #1, San Miguel, San Miguel."
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Fecha Programada"
                name="fechaprogramada"
                rules={[{ required: true, message: "Seleccione la fecha" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  placeholder="03/07/2023"
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item
                label="Nombres"
                name="nombres"
                rules={[{ required: true, message: "Ingrese sus nombres" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Gabriela Reneé" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Apellidos"
                name="apellidos"
                rules={[{ required: true, message: "Ingrese sus apellidos" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Díaz López" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Correo Electrónico"
                name="correoelectronico"
                rules={[
                  { required: true, message: "Ingrese su correo" },
                  { type: "email", message: "Ingrese un correo válido" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="gabbydiaz@gmail.com"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Teléfono"
                name="telefono"
                rules={[{ required: true, message: "Ingrese su teléfono" }]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="+503 6962 8383"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Dirección del destinatario"
                name="direcciondestinatario"
                rules={[{ required: true, message: "Ingrese la dirección" }]}
              >
                <Input
                  prefix={<EnvironmentOutlined />}
                  placeholder="Final 49 Av. Sur y Bulevar Los Próceres, Smartcenter, Bodega #8, San Salvador"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item
                label="Departamento"
                name="departamento"
                rules={[
                  { required: true, message: "Seleccione el departamento" },
                ]}
              >
                <Select placeholder="San Salvador">
                  <Option value="San Salvador">San Salvador</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Municipio"
                name="municipio"
                rules={[{ required: true, message: "Seleccione el municipio" }]}
              >
                <Select placeholder="San Salvador">
                  <Option value="San Salvador">San Salvador</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Punto de Referencia" name="puntodereferencia">
                <Input
                  prefix={<PushpinOutlined />}
                  placeholder="Cerca de redondel Arbol de la Paz"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Indicaciones" name="indicaciones">
            <Input.TextArea placeholder="Llamar antes de entregar." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleNextStep}>
              Siguiente
            </Button>
          </Form.Item>
        </Form>
      )}
      {step === 2 && (
        <>
          <Title level={4} style={{ marginBottom: 16 }}>
            Agrega tus bultos
          </Title>
          <Form form={form} onFinish={handleAddBulto} layout="vertical">
            <Space
              size="middle"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <Form.Item
                label="Largo"
                name="largo"
                rules={[{ required: true, message: "Ingrese el largo" }]}
              >
                <InputNumber min={1} placeholder="15" style={{ width: 100 }} />
              </Form.Item>
              <span style={{ margin: "auto 0" }}>cm</span>
              <Form.Item
                label="Alto"
                name="alto"
                rules={[{ required: true, message: "Ingrese el alto" }]}
              >
                <InputNumber min={1} placeholder="15" style={{ width: 100 }} />
              </Form.Item>
              <span style={{ margin: "auto 0" }}>cm</span>
              <Form.Item
                label="Ancho"
                name="ancho"
                rules={[{ required: true, message: "Ingrese el ancho" }]}
              >
                <InputNumber min={1} placeholder="15" style={{ width: 100 }} />
              </Form.Item>
              <span style={{ margin: "auto 0" }}>cm</span>
              <Form.Item
                label="Peso en libras"
                name="peso"
                rules={[{ required: true, message: "Ingrese el peso" }]}
              >
                <InputNumber
                  min={1}
                  placeholder="2 lb"
                  style={{ width: 100 }}
                />
              </Form.Item>
              <Form.Item
                label="Contenido"
                name="contenido"
                rules={[{ required: true, message: "Ingrese el contenido" }]}
              >
                <Input placeholder="iPhone 14 pro Max" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<PlusOutlined />}
                >
                  Agregar
                </Button>
              </Form.Item>
            </Space>
          </Form>
          <Divider />
          <Table
            columns={columns}
            dataSource={bultos}
            pagination={false}
            rowKey="key"
            style={{ marginBottom: 24 }}
          />
          <Space
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button icon={<ArrowLeftOutlined />} onClick={() => setStep(1)}>
              Regresar
            </Button>
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              onClick={handleSubmit}
              disabled={bultos.length === 0}
            >
              Enviar
            </Button>
          </Space>
        </>
      )}

      {/* Modal para editar  */}
      <Modal
        title="Editar Bulto"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={editingBulto || {}}
          onFinish={handleUpdateBulto}
          layout="vertical"
        >
          <Form.Item
            label="Largo"
            name="largo"
            rules={[{ required: true, message: "Ingrese el largo" }]}
          >
            <InputNumber min={1} placeholder="15" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Alto"
            name="alto"
            rules={[{ required: true, message: "Ingrese el alto" }]}
          >
            <InputNumber min={1} placeholder="15" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Ancho"
            name="ancho"
            rules={[{ required: true, message: "Ingrese el ancho" }]}
          >
            <InputNumber min={1} placeholder="15" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Peso en libras"
            name="peso"
            rules={[{ required: true, message: "Ingrese el peso" }]}
          >
            <InputNumber min={1} placeholder="2 lb" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Contenido"
            name="contenido"
            rules={[{ required: true, message: "Ingrese el contenido" }]}
          >
            <Input placeholder="iPhone 14 pro Max" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Actualizar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EnvioForm;
