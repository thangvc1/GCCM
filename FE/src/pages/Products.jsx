import {
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Upload,
  message,
} from "antd";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { num, vnd } from "../lib/format.js";
import { useStore } from "../store/StoreContext.jsx";

const emptyProduct = () => ({
  id: null,
  name: "",
  thicknessMm: null,
  weightKgM2: null,
  widthM: null,
  lengthM: null,
  unitPrice: 0,
  stockQuantityM2: 0,
  description: "",
  status: 1,
});

export default function Products() {
  const { products, saveProduct } = useStore();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Quản lý trang hiện tại để tính chính xác STT
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const filteredList = useMemo(
    () =>
      products.filter((p) => {
        const okStatus =
          statusFilter === "ALL" || p.status === Number(statusFilter);
        const okQ = p.name?.toLowerCase().includes(q.toLowerCase());
        return okStatus && okQ;
      }),
    [products, statusFilter, q],
  );

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFileList([]);
    form.setFieldsValue(emptyProduct());
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    if (record.imageUrl) {
      setFileList([
        {
          uid: "-1",
          name: "Ảnh hiện tại",
          status: "done",
          url: record.imageUrl,
        },
      ]);
    } else {
      setFileList([]);
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const productData = {
        name: values.name,
        thicknessMm: values.thicknessMm ? parseInt(values.thicknessMm) : null,
        weightKgM2: values.weightKgM2 ? parseFloat(values.weightKgM2) : null,
        widthM: values.widthM ? parseFloat(values.widthM) : null,
        lengthM: values.lengthM ? parseFloat(values.lengthM) : null,
        unitPrice: values.unitPrice ? parseFloat(values.unitPrice) : null,
        stockQuantityM2: values.stockQuantityM2
          ? parseFloat(values.stockQuantityM2)
          : null,
        description: values.description || "",
        status: parseInt(values.status),
      };

      const imageFile = fileList[0]?.originFileObj || fileList[0];
      const isEdit = !!editingProduct?.id;

      // ✅ Truyền đủ 3 tham số: id, Object JSON, File ảnh
      await saveProduct(editingProduct?.id, productData, imageFile);

      message.success(isEdit ? "Cập nhật thành công!" : "Thêm mới thành công!");
      setIsModalOpen(false);
    } catch {
      message.error("Có lỗi xảy ra khi lưu sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const product = products.find((item) => item.id === id);
      if (!product) return;

      await saveProduct(id, {
        name: product.name,
        thicknessMm: product.thicknessMm ?? null,
        weightKgM2: product.weightKgM2 ?? null,
        widthM: product.widthM ?? null,
        lengthM: product.lengthM ?? null,
        unitPrice: product.unitPrice ?? null,
        stockQuantityM2: product.stockQuantityM2 ?? null,
        description: product.description || "",
        status: Number(status),
      });
      message.success("Đã thay đổi trạng thái sản phẩm");
    } catch {
      message.error("Không thể thay đổi trạng thái sản phẩm!");
    }
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      align: "center",
      fixed: "left",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 130, // Đã mở rộng cột
      align: "center",
      render: (url) =>
        url ? (
          <img
            src={url}
            alt="product"
            style={{
              width: 70, // Đã tăng kích thước hình ảnh
              height: 70,
              objectFit: "cover",
              borderRadius: 6,
              border: "1px solid #f0f0f0",
            }}
          />
        ) : (
          <div
            style={{
              width: 70,
              height: 70,
              background: "#f5f5f5",
              borderRadius: 6,
              display: "grid",
              placeItems: "center",
              fontSize: 11,
              color: "#999",
              margin: "0 auto",
            }}
          >
            Chưa có ảnh
          </div>
        ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (name) => <strong>{name}</strong>,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Độ dày",
      dataIndex: "thicknessMm",
      key: "thicknessMm",
      align: "right",
      render: (val) => (val ? `${val} mm` : "-"),
      sorter: (a, b) => (a.thicknessMm || 0) - (b.thicknessMm || 0),
    },
    {
      title: "Trọng lượng",
      dataIndex: "weightKgM2",
      key: "weightKgM2",
      align: "right",
      render: (val) => (val ? `${val} kg/m²` : "-"),
      sorter: (a, b) => (a.weightKgM2 || 0) - (b.weightKgM2 || 0),
    },
    {
      title: "Kích thước (R x D)",
      key: "dimensions",
      align: "center",
      render: (_, record) =>
        record.widthM && record.lengthM
          ? `${record.widthM}m x ${record.lengthM}m`
          : "-",
      sorter: (a, b) =>
        (a.widthM || 0) * (a.lengthM || 0) - (b.widthM || 0) * (b.lengthM || 0),
    },
    {
      title: "Giá bán",
      dataIndex: "unitPrice",
      key: "unitPrice",
      align: "right",
      render: (val) => <strong>{vnd(val || 0)}</strong>,
      sorter: (a, b) => (a.unitPrice || 0) - (b.unitPrice || 0),
    },
    {
      title: "Tồn kho",
      dataIndex: "stockQuantityM2",
      key: "stockQuantityM2",
      align: "right",
      render: (stock) => `${num(stock || 0)} m²`,
      sorter: (a, b) => (a.stockQuantityM2 || 0) - (b.stockQuantityM2 || 0),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, record) => (
        <Select
          value={Number(status)}
          style={{ width: 150 }}
          onChange={(value) => handleStatusChange(record.id, value)}
          options={[
            { value: 1, label: "Kinh doanh" },
            { value: 0, label: "Ngừng kinh doanh" },
          ]}
        />
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleOpenEdit(record)}
          >
            Sửa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="page-head" style={{ marginBottom: 16 }}>
        <div>
          <h1>Sản phẩm GCCM</h1>
          <p className="sub">
            {num(products.length)} mặt hàng thảm bê tông trong hệ thống.
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleOpenAdd}
        >
          Thêm sản phẩm
        </Button>
      </div>

      <div
        className="filters"
        style={{ marginBottom: 16, display: "flex", gap: 12 }}
      >
        <Input
          prefix={<SearchOutlined style={{ color: "#999" }} />}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm theo tên sản phẩm..."
          style={{ maxWidth: 300 }}
          allowClear
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 180 }}
          options={[
            { value: "ALL", label: "Tất cả trạng thái" },
            { value: "1", label: "Đang kinh doanh" },
            { value: "0", label: "Ngừng kinh doanh" },
          ]}
        />
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <Table
          columns={columns}
          dataSource={filteredList}
          rowKey="id"
          /* Cấu hình scroll ngang (x) và dọc (y) */
          scroll={{ x: "max-content" }}
          /* Bỏ y: 500 */ pagination={{
            current: currentPage,
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["8", "15", "30"],
            showTotal: (total) => `Tổng cộng ${total} sản phẩm`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </div>

      {/* Modal Thêm / Sửa sản phẩm */}
      <Modal
        title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        open={isModalOpen}
        onOk={handleSave}
        confirmLoading={loading}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu sản phẩm"
        cancelText="Hủy"
        destroyOnClose
        width={650}
      >
        <Form form={form} layout="vertical" initialValues={emptyProduct()}>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input placeholder="Ví dụ: Thảm bê tông GCCM Roll 10mm" />
          </Form.Item>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Form.Item label="Độ dày (mm)" name="thicknessMm">
              <InputNumber style={{ width: "100%" }} min={0} placeholder="10" />
            </Form.Item>

            <Form.Item label="Trọng lượng (kg/m²)" name="weightKgM2">
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                placeholder="15.5"
              />
            </Form.Item>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Form.Item label="Chiều rộng (m)" name="widthM">
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                placeholder="1.0"
              />
            </Form.Item>

            <Form.Item label="Chiều dài (m)" name="lengthM">
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                placeholder="5.0"
              />
            </Form.Item>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Form.Item
              label="Giá đơn vị (VNĐ)"
              name="unitPrice"
              rules={[{ required: true, message: "Nhập giá bán" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(v) => v.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item label="Tồn kho (m²)" name="stockQuantityM2">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Form.Item label="Trạng thái" name="status">
              <Select
                options={[
                  { value: 1, label: "Đang kinh doanh" },
                  { value: 0, label: "Ngừng kinh doanh" },
                ]}
              />
            </Form.Item>

            <Form.Item label="Ảnh sản phẩm">
              <Upload
                className="product-image-upload"
                beforeUpload={() => false}
                maxCount={1}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Chọn file ảnh</Button>
              </Upload>
            </Form.Item>
          </div>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Mô tả chi tiết sản phẩm..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
