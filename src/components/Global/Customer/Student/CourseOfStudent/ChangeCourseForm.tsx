//@ts-nocheck
import { DatePicker, Divider, Form, Input, InputNumber, Modal, Select, Spin, Tooltip } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Move } from 'react-feather'
import { useForm } from 'react-hook-form'
import { branchApi, courseApi, studentChangeCourseApi } from '~/apiBase'
import { useWrap } from '~/context/wrap'
import { PaymentMethod } from '~/lib/payment-method/payment-method'
import { parseToMoney } from '~/utils/functions'

const ChangeCourseForm = React.memo((props: any) => {
	const { Option } = Select
	const { TextArea } = Input
	const [isModalVisible, setIsModalVisible] = useState(false)
	const { infoId, reloadData, infoDetail, currentPage } = props
	const [form] = Form.useForm()
	const { showNoti } = useWrap()
	const [loading, setLoading] = useState(false)
	const { setValue } = useForm()
	const [courseStudentPrice, setCourseStudentPrice] = useState(null)
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	})
	const [isLoadingCourseDetail, setIsLoadingCourseDetail] = useState(false)

	const [courseAfter, setCourseAfter] = useState<ICourse[]>()
	const [courseAfterId, setCourseAfterId] = useState()
	const [courseAfterDetail, setCourseAfterDetail] = useState<ICourseDetail>()
	const [requestMoney, setRequestMoney] = useState()
	const [branch, setBranch] = useState<IBranch[]>()

	// console.log('=========================');
	// console.log('=========================');
	// console.log('=========================');
	// console.log('=========================');
	// console.log('infoDetail: ', infoDetail);

	const fetchDataPrice = () => {
		// setIsLoading(true);
		// (async () => {
		// 	try {
		// 		const _courseStudentPrice = await courseStudentPriceApi.getDetail(infoDetail.CourseOfStudentPriceID);
		// 		_courseStudentPrice.status == 200 && setCourseStudentPrice(_courseStudentPrice.data.data);
		// 	} catch (err) {
		// 		showNoti('danger', err.message);
		// 	} finally {
		setIsLoading(false)
		// 	}
		// })();
	}

	const fetchDataSelectList = () => {
		;(async () => {
			try {
				const _branch = await branchApi.getAll({
					pageIndex: 1,
					pageSize: 99999,
					Enable: true
				})
				_branch.status == 200 && setBranch(_branch.data.data)
			} catch (err) {
				showNoti('danger', err.message)
			}
		})()
	}

	const fetchDataCourseAfter = () => {
		;(async () => {
			try {
				const _courseAfter = await courseApi.getAll({
					pageIndex: 1,
					pageSize: 99999
				})
				_courseAfter.status == 200 && setCourseAfter(_courseAfter.data.data)
			} catch (err) {
				showNoti('danger', err.message)
			}
		})()
	}

	function handleChangeCourseAfter(idCourseAfter: number) {
		setCourseAfterId(idCourseAfter)
	}

	const fetchDataCourseAfterDetail = () => {
		setIsLoadingCourseDetail(true)
		;(async () => {
			try {
				const _courseAfterDetail = await courseApi.getById(courseAfterId)
				_courseAfterDetail.status == 200 && setCourseAfterDetail(_courseAfterDetail.data.data)
			} catch (err) {
				showNoti('danger', err.message)
			} finally {
				setIsLoadingCourseDetail(false)
			}
		})()
	}

	const onSubmit = async (data: any) => {
		console.log(data)
		if (infoId) {
			if (courseAfterDetail?.Price > infoDetail?.Price) {
				showNoti('danger', 'Kh??ng ???????c chuy???n qua kh??a r??? h??n')
			} else {
				setLoading(true)
				try {
					let res = await studentChangeCourseApi.changeCourse({
						...data,
						CourseOfStudentID: infoId,
						AdditionalPayment: infoDetail?.Price - courseAfterDetail?.Price
					})
					reloadData(currentPage)
					afterSubmit(res?.data.message)
					form.resetFields()
				} catch (error) {
					showNoti('danger', error.message)
					setLoading(false)
				}
			}
		}
	}

	const afterSubmit = (mes) => {
		showNoti('success', mes)
		setLoading(false)
		setIsModalVisible(false)
	}

	useEffect(() => {
		if (isModalVisible) {
			fetchDataPrice()
			fetchDataCourseAfter()
			fetchDataSelectList()
		}
	}, [isModalVisible])

	useEffect(() => {
		if (isModalVisible == true) {
			fetchDataCourseAfterDetail()
		}
	}, [courseAfterId])

	useEffect(() => {
		if (isModalVisible == true) {
			setRequestMoney(courseAfterDetail?.Price - (courseStudentPrice?.Paid + courseStudentPrice?.Reduced))
		}
	}, [courseAfterDetail])

	return (
		<>
			<button
				className="btn btn-icon edit"
				onClick={() => {
					setIsModalVisible(true)
				}}
			>
				<Tooltip title="Chuy???n kh??a">
					<Move />
				</Tooltip>
			</button>
			<Modal title="Chuy???n kh??a" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<Divider orientation="center">Th??ng tin kh??a hi???n t???i</Divider>

						<Spin spinning={isLoading}>
							<div className="row">
								<div className="col-12">
									<Form.Item label="H???c vi??n">
										<Input disabled={true} className="style-input" readOnly={true} value={infoDetail.FullNameUnicode} />
									</Form.Item>
								</div>
							</div>
							<div className="row">
								<div className="col-12">
									<Form.Item label="Kh??a h???c">
										<Input className="style-input" readOnly={true} value={infoDetail.CourseName} />
									</Form.Item>
								</div>
							</div>

							{courseStudentPrice != null && (
								<>
									<div className="row">
										<div className="col-md-6 col-12">
											<Form.Item label="Gi?? ti???n">
												<Input
													defaultValue={Intl.NumberFormat('ja-JP').format(courseStudentPrice.Price)}
													className="style-input"
													readOnly={true}
												/>
											</Form.Item>
										</div>

										<div className="col-md-6 col-12">
											<Form.Item label="Gi???m gi??">
												<Input
													defaultValue={Intl.NumberFormat('ja-JP').format(courseStudentPrice.Reduced)}
													className="style-input"
													readOnly={true}
												/>
											</Form.Item>
										</div>
									</div>

									<div className="row">
										<div className="col-md-6 col-12">
											<Form.Item label="???? ????ng">
												<Input value={Intl.NumberFormat('ja-JP').format(courseStudentPrice.Paid)} className="style-input" readOnly={true} />
											</Form.Item>
										</div>

										<div className="col-md-6 col-12">
											<Form.Item label="C??n l???i">
												<Input
													value={Intl.NumberFormat('ja-JP').format(courseStudentPrice.MoneyInDebt)}
													className="style-input"
													readOnly={true}
												/>
											</Form.Item>
										</div>
									</div>
								</>
							)}

							<Divider orientation="center">Kh??a chuy???n ?????n</Divider>
							{courseAfter != null && (
								<div className="row">
									<div className="col-12">
										<Form.Item name="CourseIDAfter" label="Kh??a h???c chuy???n ?????n">
											<Select
												style={{ width: '100%' }}
												className="style-input"
												onChange={handleChangeCourseAfter}
												placeholder="Ch???n kh??a h???c chuy???n ?????n"
											>
												{courseAfter?.map((item, index) => (
													<Option key={index} value={item.ID}>
														{item.CourseName}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>
								</div>
							)}

							<Spin spinning={isLoadingCourseDetail}>
								<div className="row">
									<div className="col-md-6 col-12">
										<Form.Item label="Gi?? kh??a m???i">
											<Input
												className="style-input w-100"
												readOnly={true}
												value={courseAfterDetail != null ? Intl.NumberFormat('ja-JP').format(courseAfterDetail.Price) : ''}
											/>
										</Form.Item>
									</div>

									<div className="col-md-6 col-12">
										<Form.Item label="Gi?? kh??a c??">
											<Input
												className="style-input w-100"
												readOnly={true}
												// value={requestMoney != null ? Intl.NumberFormat('ja-JP').format(requestMoney) : ''}
												value={parseToMoney('' + infoDetail?.Price)}
											/>
										</Form.Item>
									</div>
								</div>

								<div className="row">
									<div className="col-md-6 col-12">
										<Form.Item label="S??? ti???n ph???i tr??? th??m">
											<Input
												className="style-input w-100"
												readOnly={true}
												value={
													courseAfterDetail?.Price !== undefined ? parseToMoney('' + (infoDetail?.Price - courseAfterDetail?.Price)) : 0
												}
											/>
										</Form.Item>
									</div>

									<div className="col-md-6 col-12">
										<Form.Item name="PayDate" label="Ng??y h???n tr???" rules={[{ required: false, message: 'Vui l??ng ??i???n ????? th??ng tin!' }]}>
											<DatePicker
												defaultValue={moment(new Date(), 'DD/MM/YYYY')}
												allowClear={true}
												format="DD/MM/YYYY"
												className="style-input"
												onChange={(e) => setValue('PayDate', e)}
											/>
										</Form.Item>
									</div>
								</div>

								<div className="row">
									<div className="col-md-6 col-12">
										<Form.Item
											name="PaymentMethodsID"
											label="H??nh th???c thanh to??n"
											rules={[
												{
													required: true,
													message: 'Vui l??ng ??i???n ????? th??ng tin!'
												}
											]}
										>
											<Select className="style-input" allowClear={true}>
												{PaymentMethod?.map((item, index) => (
													<Option key={index} value={item.id}>
														{item.Name}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>

									<div className="col-md-6 col-12">
										<Form.Item name="PayBranchID" label="Trung t??m thanh to??n">
											<Select className="style-input" showSearch optionFilterProp="children" allowClear={true}>
												{branch?.map((item, index) => (
													<Option key={index} value={item.ID}>
														{item.BranchName}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>
								</div>
							</Spin>

							<div className="row">
								<div className="col-12">
									<Form.Item name="Paid" label="Thanh to??n" rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}>
										<InputNumber
											placeholder="S??? ti???n c??n l???i c???n ph???i thanh to??n"
											className="ant-input style-input w-100"
											formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
											parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
											onChange={(value) => setValue('Paid', value)}
										/>
									</Form.Item>
								</div>
							</div>

							<div className="row">
								<div className="col-12">
									<Form.Item name="NoteBill" label="Ghi ch?? thanh to??n">
										<TextArea className="style-input w-100" onChange={(e) => setValue('Note', e.target.value)} allowClear={true} />
									</Form.Item>
								</div>
							</div>

							<div className="row">
								<div className="col-12">
									<Form.Item name="Commitment" label="Cam k???t">
										<TextArea className="style-input w-100" onChange={(e) => setValue('Commitment', e.target.value)} allowClear={true} />
									</Form.Item>
								</div>
							</div>

							<div className="row">
								<div className="col-12">
									<Form.Item name="Note" label="Ghi ch??">
										<TextArea className="style-input w-100" onChange={(e) => setValue('Note', e.target.value)} allowClear={true} />
									</Form.Item>
								</div>
							</div>
						</Spin>

						{/*  */}
						<div className="row ">
							<div className="col-12">
								<button type="submit" className="btn btn-primary w-100">
									L??u
									{loading == true && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
})

export default ChangeCourseForm
