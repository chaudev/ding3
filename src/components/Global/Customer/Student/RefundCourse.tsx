import { Button, Form, Input, Modal, Tooltip } from 'antd'
import React, { useState } from 'react'

const RefundCourse = () => {
	const { TextArea } = Input

	const [isModalVisible, setIsModalVisible] = useState(false)

	return (
		<>
			<Tooltip title="Hoàn tiền">
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsModalVisible(true)
					}}
				>
					<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16, marginBottom: -1 }}></i>
				</button>
			</Tooltip>

			<Modal
				title="Hoàn tiền"
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={
					<div className="row">
						<div className="col-12 d-flex justify-content-end">
							<div style={{ paddingRight: 5 }}>
								<Button type="primary" size="large">
									Xác nhận
								</Button>
							</div>
							<div>
								<Button onClick={() => setIsModalVisible(false)} type="default" size="large">
									Cancel
								</Button>
							</div>
						</div>
					</div>
				}
			>
				<div className="wrap-form">
					<Form layout="vertical">
						{/*  */}
						<div className="row">
							<div className="col-6">
								<Form.Item label="Học viên">
									<Input className="style-input" placeholder="" />
								</Form.Item>
							</div>
							<div className="col-6">
								<Form.Item label="Đã đóng">
									<Input className="style-input" placeholder="" />
								</Form.Item>
							</div>
						</div>
						{/*  */}
						<div className="row">
							<div className="col-6">
								<Form.Item label="Hoàn trả">
									<Input className="style-input" placeholder="" />
								</Form.Item>
							</div>
							<div className="col-6">
								<Form.Item label="Xóa khỏi khóa">
									<Input className="style-input" placeholder="" />
								</Form.Item>
							</div>
						</div>
						{/*  */}
						<div className="row">
							<Form.Item label="Ghi chú">
								<TextArea rows={2} />
							</Form.Item>
						</div>
						{/*  */}
					</Form>
				</div>
			</Modal>
		</>
	)
}

export default RefundCourse
