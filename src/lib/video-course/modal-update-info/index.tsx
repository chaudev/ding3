import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Spin, Upload, Button, Select, Tooltip, Image } from 'antd'
import { useForm } from 'react-hook-form'
import { UploadOutlined } from '@ant-design/icons'
import { useWrap } from '~/context/wrap'
import { newsFeedApi } from '~/apiBase'
import EditorSimple from '~/components/Elements/EditorSimple'
import { parseToMoney } from '~/utils/functions'
import 'antd/dist/antd.css'
import { VideoCourseDetailApi } from '~/apiBase/video-course-details'
import { VideoCourseCategoryApi } from '~/apiBase/video-course-store/category'
import { VideoCourseLevelApi, VideoCuorseTag } from '~/apiBase/video-course-store/level'
import NumberFormat from 'react-number-format'

const { Option } = Select

const initDetails = {
	VideoCourseName: '',
	Slogan: '',
	Requirements: '',
	Description: '',
	ResultsAchieved: '',
	CourseForObject: '',
	TotalRating: 0,
	RatingNumber: 0,
	TotalStudent: 0,
	CreatedBy: ''
}

const ModalUpdateInfo = React.memo((props: any) => {
	const {
		_onSubmitEdit,
		programID,
		rowData,
		isModalVisible,
		setIsModalVisible,
		refeshData,
		dataCategory,
		dataLevel,
		dataCurriculum,
		tags,
		onRefeshTags
	} = props
	const [form] = Form.useForm()
	const [imageSelected, setImageSelected] = useState({ name: '' })
	const [previewImage, setPreviewImage] = useState('')
	const [buttonLoading, setButtonLoading] = useState(false)

	const [modalCate, setModalCate] = useState(false)
	const [modalLevel, setModalLevel] = useState(false)
	const [modalTags, setModalTags] = useState(false)
	const [newType, setNewType] = useState('')
	const [newLevel, setNewLevel] = useState('')
	const [newTag, setNewTag] = useState('')
	const [level, setLevel] = useState(0)
	const [category, setCategory] = useState(0)
	const [curriculumID, setCurriculumID] = useState(0)
	const [tagArray, setTagArray] = useState('')

	const { handleSubmit } = useForm()

	const [loading, setLoading] = useState(true)
	const { showNoti } = useWrap()

	// HANDLE SUBMIT
	const onSubmit = handleSubmit(() => {
		updateDetails()
	})

	useEffect(() => {
		const value = form.getFieldValue('OriginalPrice')
		if (value !== null && value !== undefined) {
			form.setFieldsValue({ OriginalPrice: parseToMoney(value.toString().replace(/[^0-9\.]+/g, '')) })
		}
	}, [form.getFieldValue('OriginalPrice')])

	useEffect(() => {
		const value = form.getFieldValue('SellPrice')
		if (value !== null && value !== undefined) {
			form.setFieldsValue({ SellPrice: parseToMoney(value.toString().replace(/[^0-9\.]+/g, '')) })
		}
	}, [form.getFieldValue('SellPrice')])

	// IS VISIBLE MODAL
	React.useEffect(() => {
		if (isModalVisible) {
			if (programID) {
				setLevel(rowData.LevelID)
				setCurriculumID(rowData.CurriculumID)
				setCategory(rowData.CategoryID)
				setTagArray(rowData?.TagArray)
				form.setFieldsValue({
					Name: rowData.VideoCourseName,
					SellPrice: rowData.SellPrice,
					Teacher: rowData.TeacherName,
					ChineseName: rowData.ChineseName,
					EnglishName: rowData.EnglishName,
					Curriculum: rowData.CurriculumID,
					Level: rowData.LevelName,
					Type: rowData.CategoryName,
					Slogan: rowData.Slogan,
					OriginalPrice: rowData.OriginalPrice,
					Requirements: rowData.Requirements,
					Description: rowData.Description,
					ResultsAchieved: rowData.ResultsAchieved,
					ExpiryDays: rowData.ExpiryDays,
					CourseForObject: rowData.CourseForObject,
					LimitMinutes: rowData.LimitMinutes,
					LimitBooking: rowData.LimitBooking,
					RequestPoint: rowData.RequestPoint
				})
				getCourseDetails(programID)
			}
		}
	}, [isModalVisible])

	const getDefault = (data) => {
		if (data !== '') {
			const temp = data.split(',')
			let tamp = []
			if (temp.length > 0) {
				for (let i = 0; i < temp.length; i++) {
					tamp.push(parseInt(temp[i]))
				}
			}
			return tamp
		} else {
			return []
		}
	}

	// on change isModalVisible
	React.useEffect(() => {
		if (!isModalVisible) {
			setImageSelected({ name: '' })
			form.resetFields()
		}
	}, [isModalVisible])

	// Call api upload image
	const uploadFile = async (file: any, props: any) => {
		setButtonLoading(true)
		try {
			let res = await newsFeedApi.uploadFile(file.originFileObj)
			if (res.status == 200 || res.status == 204) {
				_onSubmitEdit({ ...props, ImageThumbnails: res.data.data })
			}
		} catch (error) {
			showNoti('danger', error.message)
		}
	}

	// Upload file audio
	const handleUploadFile = async (info) => {
		setImageSelected(info.file)
		setPreviewImage(URL.createObjectURL(info.file.originFileObj))
	}

	const [details, setDetails] = useState(initDetails)
	const [slogan, setSlogan] = useState('')
	const [requirements, setRequirements] = useState('')
	const [description, setDescription] = useState('')
	const [resultsAchieved, setResultsAchieved] = useState('')
	const [courseForObject, setCourseForObject] = useState('')

	// Init data
	React.useEffect(() => {
		if (details !== initDetails) {
			setDescription(details?.Description || '')
			setCourseForObject(details?.CourseForObject || '')
			setRequirements(details?.Requirements || '')
			setResultsAchieved(details?.ResultsAchieved || '')
			setSlogan(details?.Slogan || '')
			setLoading(false)
			form.setFieldsValue({
				Slogan: details?.Slogan,
				Requirements: details?.Requirements,
				CourseForObject: details?.CourseForObject,
				ResultsAchieved: details?.ResultsAchieved,
				Description: details?.Description,
				VideoCourseName: details?.VideoCourseName
			})
		}
	}, [details])

	// CALL API DETAILS
	const getCourseDetails = async (param) => {
		setLoading(true)
		try {
			const res = await VideoCourseDetailApi.getDetails(param)
			res.status == 200 && setDetails(res.data.data)
		} catch (error) {}
	}

	// HANDLE UPDATE
	const updateDetails = async () => {
		setButtonLoading(true)
		let temp = {
			ID: rowData.ID,
			CategoryID: category,
			LevelID: level,
			CurriculumID: curriculumID,
			TeacherID: '',
			TagArray: tagArray,
			ChineseName: '',
			EnglishName: form.getFieldValue('EnglishName'),
			VideoCourseName: form.getFieldValue('VideoCourseName'),
			OriginalPrice: form.getFieldValue('OriginalPrice').replace(/[^0-9\.]+/g, ''),
			SellPrice: form.getFieldValue('SellPrice').replace(/[^0-9\.]+/g, ''),
			ImageThumbnails: rowData?.ImageThumbnails || null,
			Slogan: slogan,
			Requirements: requirements,
			Description: description,
			ResultsAchieved: resultsAchieved,
			CourseForObject: courseForObject,
			ExpiryDays: form.getFieldValue('ExpiryDays'),
			LimitMinutes: form.getFieldValue('LimitMinutes'),
			LimitBooking: form.getFieldValue('LimitBooking'),
			RequestPoint: form.getFieldValue('RequestPoint')
		}
		try {
			if (imageSelected.name === '') {
				_onSubmitEdit(temp)
			} else {
				uploadFile(imageSelected, temp)
			}
		} catch (e) {}
	}

	const createType = async () => {
		setButtonLoading(true)
		try {
			const res = await VideoCourseCategoryApi.add({ CategoryName: newType, Enable: 'True' })
			res.status == 200 &&
				(setModalCate(false),
				setIsModalVisible(true),
				refeshData(),
				showNoti('success', 'Th??m th??nh c??ng'),
				setNewType(''),
				form.setFieldsValue({ TypeName: '' }))
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setButtonLoading(false)
		}
	}

	const createLevel = async () => {
		setButtonLoading(true)
		try {
			const res = await VideoCourseLevelApi.add({ LevelName: newLevel, Enable: 'True' })
			res.status == 200 &&
				(setModalLevel(false),
				setIsModalVisible(true),
				refeshData(),
				showNoti('success', 'Th??m th??nh c??ng'),
				setNewLevel(''),
				form.setFieldsValue({ LevelName: '' }))
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setButtonLoading(false)
		}
	}

	const createTag = async () => {
		setButtonLoading(true)
		try {
			await VideoCuorseTag.add({ Name: newTag })
		} catch (error) {
			error?.message?.ID !== undefined
				? (showNoti('success', 'Th??m th??nh c??ng'),
				  setIsModalVisible(true),
				  setModalTags(false),
				  onRefeshTags(),
				  setNewTag(''),
				  form.setFieldsValue({ newTag: '' }))
				: showNoti('danger', error.message)
		} finally {
			setButtonLoading(false)
		}
	}

	// Handle delete image
	const handleDeleteImage = () => {
		setImageSelected({ name: '' })
		setPreviewImage('')
	}

	function handleChange(value) {
		setTagArray(`${value}`)
		form.setFieldsValue({ newTag: `${value}` })
	}

	useEffect(() => {
		return () => {
			previewImage !== '' && URL.revokeObjectURL(previewImage)
		}
	}, [imageSelected])

	// RENDER
	return (
		<>
			<Modal
				confirmLoading={loading}
				title="Th??m lo???i"
				width={400}
				visible={modalCate}
				onCancel={() => (setModalCate(false), setIsModalVisible(true))}
				onOk={() => createType()}
			>
				<Form form={form} layout="vertical" onFinish={() => createType()}>
					<div className="col-md-12 col-12">
						<Form.Item name="TypeName" label="T??n lo???i" rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}>
							<Input
								placeholder=""
								className="style-input"
								defaultValue={newType}
								value={newType}
								onChange={(e) => setNewType(e.target.value)}
							/>
						</Form.Item>
					</div>
				</Form>
			</Modal>
			<Modal
				confirmLoading={loading}
				title="Th??m tr??nh ?????"
				width={400}
				visible={modalLevel}
				onCancel={() => (setModalLevel(false), setIsModalVisible(true))}
				onOk={() => createLevel()}
			>
				<Form form={form} layout="vertical" onFinish={() => createLevel()}>
					<div className="col-md-12 col-12">
						<Form.Item name="LevelName" label="T??n tr??nh ?????" rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}>
							<Input
								placeholder=""
								className="style-input"
								defaultValue={newLevel}
								value={newLevel}
								onChange={(e) => setNewLevel(e.target.value)}
							/>
						</Form.Item>
					</div>
				</Form>
			</Modal>
			<Modal
				confirmLoading={loading}
				title="Th??m t??? kh??a t??m ki???m"
				width={400}
				visible={modalTags}
				onCancel={() => (setModalTags(false), setIsModalVisible(true))}
				onOk={() => createTag()}
			>
				<Form form={form} layout="vertical" onFinish={() => createTag()}>
					<div className="col-md-12 col-12">
						<Form.Item name="newTag" label="T??? kh??a t??m ki???m m???i" rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}>
							<Input
								placeholder=""
								className="style-input"
								defaultValue={newTag}
								value={newTag}
								onChange={(e) => setNewTag(e.target.value)}
							/>
						</Form.Item>
					</div>
				</Form>
			</Modal>

			{/* Main modal */}
			<Modal
				className="m-create-vc"
				title={`S???a th??ng tin kho?? h???c`}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="row m-0 p-0">
					<Form form={form} layout="vertical" onFinish={() => onSubmit()}>
						<div className="row p-0 m-0">
							<div className="row p-0 m-0 custom-scroll-bar col-md-12 col-12">
								<div className="row vc-e-d">
									<div className="row p-0 m-0 col-md-6 col-12">
										<div className="col-md-6 col-12">
											<Form.Item name="EnglishName" label="T??n ti???ng Anh" rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}>
												<Input
													placeholder=""
													defaultValue={rowData?.EnglishName}
													className="style-input"
													onChange={(e) => form.setFieldsValue({ EnglishName: e.target.value })}
												/>
											</Form.Item>
										</div>

										<div className="col-md-6 col-12">
											<Form.Item
												name="VideoCourseName"
												label="T??n ti???ng Vi???t"
												rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}
											>
												<Input
													placeholder=""
													defaultValue={rowData?.VideoCourseName}
													className="style-input"
													onChange={(e) => form.setFieldsValue({ VideoCourseName: e.target.value })}
												/>
											</Form.Item>
										</div>

										<div className="col-md-6 col-12">
											<Form.Item
												name="LimitBooking"
												label="S??? l?????t book Zoom 1-1"
												rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}
											>
												<NumberFormat
													defaultValue={rowData?.LimitBooking}
													placeholder="S??? l?????t book: 5"
													className="ant-input style-input w-100"
													onChange={(e: any) => form.setFieldsValue({ LimitBooking: e.target.value })}
												/>
											</Form.Item>
										</div>

										<div className="col-md-6 col-12">
											<Form.Item
												name="RequestPoint"
												label="S??? ??i???m c???n ????? ???????c h???c"
												rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}
											>
												<NumberFormat
													defaultValue={rowData?.RequestPoint}
													placeholder="S??? ??i???m: 8"
													className="ant-input style-input w-100"
													onChange={(e: any) => form.setFieldsValue({ RequestPoint: e.target.value })}
												/>
											</Form.Item>
										</div>

										<div className="col-md-6 col-12">
											<Form.Item
												name="LimitMinutes"
												label="S??? ph??t / l?????t"
												rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}
											>
												<NumberFormat
													defaultValue={rowData?.LimitMinutes}
													placeholder="S??? ph??t: 60"
													className="ant-input style-input w-100"
													onChange={(e: any) => form.setFieldsValue({ LimitMinutes: e.target.value })}
												/>
											</Form.Item>
										</div>

										<div className="col-md-6 col-12">
											<Form.Item
												name="ExpiryDays"
												label=" " // CH??? N??Y B??A ????? HI???N C??I TOOLTIP. X??A KHO???N TR???NG M???T LU??N TOOLTIP
												tooltip={{
													title: 'Nh???p 0 ho???c b??? tr???ng th?? kh??ng c?? h???n s??? d???ng',
													icon: (
														<div className="row ">
															<span className="mr-1 mt-3" style={{ color: '#000' }}>
																S??? ng??y s??? d???ng
															</span>
															<i className="fas fa-question-circle"></i>
														</div>
													)
												}}
												rules={[{ required: false, message: 'B???n kh??ng ???????c ????? tr???ng' }]}
											>
												<NumberFormat
													defaultValue={rowData.expiryDays}
													placeholder="S??? ph??t: 60"
													className="ant-input style-input w-100"
													onChange={(e: any) => form.setFieldsValue({ ExpiryDays: e.target.value })}
												/>
											</Form.Item>
										</div>

										<div className="col-md-6 col-12">
											<Form.Item
												name="Curriculum"
												label=" " // CH??? N??Y B??A ????? HI???N C??I TOOLTIP. X??A KHO???N TR???NG M???T LU??N TOOLTIP
												tooltip={{
													title: 'Ch??? hi???n th??? gi??o tr??nh c?? video',
													icon: (
														<div className="row ">
															<span className="mr-1 mt-3" style={{ color: '#000' }}>
																Gi??o tr??nh
															</span>
															<i className="fas fa-question-circle"></i>
														</div>
													)
												}}
												rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}
											>
												<Select
													style={{ width: '100%' }}
													className="style-input"
													showSearch
													aria-selected
													placeholder="Ch???n lo???i..."
													optionFilterProp="children"
													onChange={(e: number) => setCurriculumID(e)}
												>
													{dataCurriculum.map((item, index) => (
														<Option key={index} value={item.ID}>
															{item.CurriculumName}
														</Option>
													))}
												</Select>
											</Form.Item>
										</div>

										<div className="col-md-6 col-12">
											<Form.Item
												name="Type"
												rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}
												label={
													<div className="row m-0">
														Lo???i{' '}
														<Tooltip title="Th??m lo???i m???i">
															<button
																onClick={() => (setModalCate(true), setIsModalVisible(false))}
																className="btn btn-primary btn-vc-create ml-1"
															>
																<div style={{ marginTop: -2 }}>+</div>
															</button>
														</Tooltip>
													</div>
												}
											>
												<Select
													style={{ width: '100%' }}
													className="style-input"
													showSearch
													aria-selected
													placeholder="Ch???n lo???i..."
													optionFilterProp="children"
													onChange={(e: number) => setCategory(e)}
												>
													{dataCategory.map((item, index) => (
														<Option key={index} value={item.ID}>
															{item.CategoryName}
														</Option>
													))}
												</Select>
											</Form.Item>
										</div>

										<div className="col-md-6 col-12">
											<Form.Item
												name="Level"
												label={
													<div className="row m-0">
														Tr??nh ?????{' '}
														<Tooltip title="Th??m tr??nh ????? m???i">
															<button
																onClick={() => (setModalLevel(true), setIsModalVisible(false))}
																className="btn btn-primary btn-vc-create ml-1"
															>
																<div style={{ marginTop: -2 }}>+</div>
															</button>
														</Tooltip>
													</div>
												}
												rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}
											>
												<Select
													style={{ width: '100%' }}
													className="style-input"
													showSearch
													placeholder="Ch???n tr??nh ?????..."
													optionFilterProp="children"
													onChange={(e: number) => setLevel(e)}
												>
													{dataLevel.map((item: any, index: number) => (
														<Option key={index} value={item.ID}>
															{item.LevelName}
														</Option>
													))}
												</Select>
											</Form.Item>
										</div>

										<div className="col-md-6 col-12">
											<Form.Item name="SellPrice" label="Gi?? b??n" rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}>
												<NumberFormat
													defaultValue={rowData.SellPrice}
													placeholder=""
													className="ant-input style-input w-100"
													onChange={(e: any) => form.setFieldsValue({ SellPrice: e.target.value })}
													thousandSeparator={true}
												/>
											</Form.Item>
										</div>

										<div className="col-md-6 col-12">
											<Form.Item name="OriginalPrice" label="Gi?? g???c" rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}>
												<NumberFormat
													defaultValue={rowData.OriginalPrice}
													placeholder=""
													className="ant-input style-input w-100"
													onChange={(e: any) => form.setFieldsValue({ OriginalPrice: e.target.value })}
													thousandSeparator={true}
												/>
											</Form.Item>
										</div>

										{programID && (
											<div className="col-md-6 col-12">
												<Form.Item name="Image" label="H??nh ???nh thu nh???">
													<Upload
														style={{ width: 800 }}
														className="vc-e-upload"
														onChange={(e) => handleUploadFile(e)}
														showUploadList={false}
													>
														<Button className="vc-e-upload" icon={<UploadOutlined style={{ marginTop: -2 }} />}>
															B???m ????? t???i h??nh ???nh
														</Button>
													</Upload>
													{imageSelected.name !== undefined && imageSelected.name !== '' && (
														<div className="row m-0 mt-3 vc-store-center">
															<Button danger onClick={handleDeleteImage}>
																Xo?? h??nh ???nh
															</Button>
														</div>
													)}
												</Form.Item>
												<p className="font-weight-primary mb-4" style={{ color: 'red' }}>
													*L??u ??: Upload t???i ??a 100Mb
												</p>
											</div>
										)}

										<div className="col-md-6 col-12"></div>
										{/* preview image */}
										{previewImage !== '' && (
											<div className="col-md-6 col-12 mb-3" style={{ marginTop: -10 }}>
												<Image className="image_wrapper" src={previewImage} />
											</div>
										)}

										{previewImage === '' && !!rowData?.ImageThumbnails && (
											<div className="col-md-6 col-12 mb-3" style={{ marginTop: -10 }}>
												<Image className="image_wrapper" src={rowData?.ImageThumbnails} />
											</div>
										)}

										{!loading && (
											<div className="col-12">
												{tags.length > 0 && (
													<Form.Item
														name="TagArray"
														label={
															<div className="row m-0">
																T??? kh??a t??m ki???m{' '}
																<Tooltip title="Th??m t??? kh??a t??m ki???m">
																	<button
																		onClick={() => (setModalTags(true), setIsModalVisible(false))}
																		className="btn btn-primary btn-vc-create ml-1"
																	>
																		<div style={{ marginTop: -2, marginLeft: 1 }}>+</div>
																	</button>
																</Tooltip>
																{tagArray !== '' && <div style={{ color: '#f44d4f', fontSize: 12, marginLeft: 5 }}>*</div>}
															</div>
														}
														rules={[{ required: tagArray == '' ? true : false, message: 'B???n kh??ng ???????c ????? tr???ng' }]}
													>
														<Select
															mode="tags"
															className="style-input"
															style={{ width: '100%' }}
															placeholder="T??? kh??a t??m ki???m"
															searchValue=""
															defaultValue={getDefault(tagArray)}
															onChange={(e) => handleChange(e)}
														>
															{tags.map((item, index) => (
																<Option key={index} value={item.ID}>
																	{item.Name}
																</Option>
															))}
														</Select>
													</Form.Item>
												)}
											</div>
										)}
									</div>

									<div className="row p-0 m-0 custom-scroll-bar col-md-6 col-12">
										{loading ? (
											<div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
												<Spin size="large" />
											</div>
										) : (
											<div className="row vc-e-d" style={{ height: !!imageSelected.name || !!rowData?.ImageThumbnails ? 753 : 605 }}>
												<div className="col-md-12 col-12">
													<Form.Item name="Slogan" label="Slogan">
														<EditorSimple
															defaultValue={slogan}
															handleChange={(e) => setSlogan(e)}
															isTranslate={false}
															isSimpleTool={true}
															height={90}
														/>
													</Form.Item>
												</div>
												<div className="col-md-12 col-12">
													<Form.Item name="Requirements" label="??i???u ki???n h???c">
														<EditorSimple
															defaultValue={requirements}
															handleChange={(e) => setRequirements(e)}
															isTranslate={false}
															isSimpleTool={true}
															height={90}
														/>
													</Form.Item>
												</div>
												<div className="col-md-12 col-12">
													<Form.Item name="CourseForObject" label="?????i t?????ng h???c">
														<EditorSimple
															defaultValue={courseForObject}
															handleChange={(e) => setCourseForObject(e)}
															isTranslate={false}
															isSimpleTool={true}
															height={90}
														/>
													</Form.Item>
												</div>
												<div className="col-md-12 col-12">
													<Form.Item name="ResultsAchieved" label="N???i dung kh??a h???c">
														<EditorSimple
															defaultValue={resultsAchieved}
															handleChange={(e) => setResultsAchieved(e)}
															isTranslate={false}
															isSimpleTool={true}
															height={90}
														/>
													</Form.Item>
												</div>
												<div className="col-md-12 col-12">
													<Form.Item name="Description" label="M?? t???">
														<EditorSimple
															defaultValue={description}
															handleChange={(e) => setDescription(e)}
															isTranslate={false}
															isSimpleTool={true}
															height={90}
														/>
													</Form.Item>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>

						{/* footer */}
						<div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
							<div className="m-0 p-0" style={{ justifyContent: 'flex-end', display: 'flex' }}>
								<button onClick={() => setIsModalVisible(false)} className="btn btn-warning mr-3">
									Hu???
								</button>
								<button type="submit" className="btn btn-primary">
									L??u thay ?????i
									{buttonLoading && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
})

export default ModalUpdateInfo
