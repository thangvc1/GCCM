import { Typography } from "antd";
import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ContactSection() {
  return (
    <div className="pops-contact-wrap" id="lien-he">
      <div className="pops-contact-header">
        <Text className="pops-contact-kicker">Liên hệ</Text>
        <Title className="pops-contact-title">
          CÔNG TY TNHH THẢM BÊ TÔNG VIỆT NAM
        </Title>
      </div>

      <div className="pops-contact-grid">
        <div className="pops-contact-cards">
          <div className="pops-contact-item">
            <div className="pops-contact-icon blue">
              <EnvironmentOutlined />
            </div>
            <div className="pops-contact-content">
              <Text className="pops-contact-label">Địa Chỉ</Text>
              <Text className="pops-contact-value">
                Số nhà 48, Đường Phạm Ngũ Lão, TDP La Mát, Phường Châu Sơn, Tỉnh
                Ninh Bình, Việt Nam
              </Text>
            </div>
          </div>

          <div className="pops-contact-item">
            <div className="pops-contact-icon orange">
              <PhoneOutlined />
            </div>
            <div className="pops-contact-content">
              <Text className="pops-contact-label">Điện Thoại / Zalo</Text>
              <Text className="pops-contact-value strong">
                0345 412 152 - 0375 033 487
              </Text>
              <Text className="pops-contact-sub">
                Liên hệ Zalo ngay để được tư vấn
              </Text>
            </div>
          </div>

          <div className="pops-contact-item">
            <div className="pops-contact-icon blue">
              <MailOutlined />
            </div>
            <div className="pops-contact-content">
              <Text className="pops-contact-label">Email</Text>
              <Text className="pops-contact-value strong accent">
                Thambetong01@gmail.com
              </Text>
            </div>
          </div>

          <button type="button" className="pops-contact-submit-btn">
            GỌI NGAY ĐỂ TƯ VẤN MIỄN PHÍ
          </button>
        </div>
      </div>
    </div>
  );
}
