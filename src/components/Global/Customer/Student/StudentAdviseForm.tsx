import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Modal, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import InputTextField from '~/components/FormControl/InputTextField'
import SelectField from '~/components/FormControl/SelectField'
import { useWrap } from '~/context/wrap'

let returnSchema = {}
let schema = null

const StudentAdviseForm = React.memo((props: any) => {
	const [isModalVisible, setIsModalVisible] = useState(false)
	const { isLoading, rowID, _onSubmit, getIndex, index, rowData, listData, dataProgram } = props

	const { showNoti, userInformation } = useWrap()

	// -----  HANDLE ALL IN FORM -------------
	const defaultValuesInit = {
		AreaID: null, //int
		CustomerName: null,
		ChineseName: null,
		Number: null, //số điện thoại
		Email: '', //
		SourceInformationID: null, //int ID nguồn khách
		CustomerConsultationStatusID: null, // tình trạng tư vấn
		ProgramID: null,
		CounselorsID: null
	}

	;(function returnSchemaFunc() {
		returnSchema = { ...defaultValuesInit }
		Object.keys(returnSchema).forEach(function (key) {
			switch (key) {
				case 'Email':
					returnSchema[key] = yup.string().email('Email nhập sai cú pháp').required('Bạn không được để trống')
					break
				case 'CustomerName':
					returnSchema[key] = yup.mixed().required('Bạn không được để trống')
					break
				case 'SourceInformationID':
					returnSchema[key] = yup.mixed()
					break
				case 'CustomerConsultationStatusID':
					returnSchema[key] = yup.mixed().required('Bạn không được để trống')
					break
				case 'ProgramID':
					returnSchema[key] = yup.mixed()
					break
				case 'Number':
					returnSchema[key] = yup.mixed().required('Bạn không được để trống')
					break
				// case 'CounselorsID':
				// 	returnSchema[key] = yup.mixed().required('Bạn không được để trống');
				// 	break;
				default:
					// returnSchema[key] = yup.mixed().required("Bạn không được để trống");
					break
			}
		})

		schema = yup.object().shape(returnSchema)
	})()

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	})

	// SUBMI FORM
	const onSubmit = (data: any, e) => {
		delete data.Note
		let res = _onSubmit({ ...data, ChineseName: '' })
		res.then(function (rs: any) {
			rs && rs.status == 200 && (setIsModalVisible(false), form.reset(defaultValuesInit))
		})
	}

	useEffect(() => {
		if (isModalVisible) {
			if (rowData) {
				form.reset(rowData)
			} else {
				form.setValue('CustomerConsultationStatusID', 1)
			}
		}
	}, [isModalVisible])

	return (
		<>
			{rowID ? (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsModalVisible(true)
						getIndex(index)
					}}
				>
					<Tooltip title="Cập nhật">
						<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16, marginBottom: -1 }}></i>
					</Tooltip>
				</button>
			) : (
				<button
					className="btn btn-warning add-new"
					onClick={() => {
						setIsModalVisible(true)
					}}
				>
					Thêm mới
				</button>
			)}

			{/*  */}
			<Modal
				title={rowID ? 'Sửa học viên cần tư vấn' : 'Thêm học viên cần tư vấn'}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
						<div className="row">
							<div className="col-md-12 col-12">
								<InputTextField form={form} name="CustomerName" label="Họ tên" isRequired={true} />
							</div>
						</div>
						<div className="row">
							<div className="col-md-6 col-12">
								<SelectField form={form} name="ProgramID" label="Nhu cầu học" optionList={listData.Program} isRequired={false} />
							</div>
							<div className="col-md-6 col-12">
								<SelectField form={form} name="AreaID" label="Tỉnh/TP" optionList={listData.Area} />
							</div>
						</div>

						<div className="row">
							<div className="col-md-6 col-12">
								<InputTextField form={form} name="Number" label="Số điện thoại" isRequired={true} />
							</div>
							<div className="col-md-6 col-12">
								<InputTextField form={form} name="Email" label="Email" isRequired={true} />
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="SourceInformationID"
									label="Nguồn khách"
									optionList={listData.SourceInformation}
									isRequired={false}
								/>
							</div>

							<div className="col-md-6 col-12">
								<SelectField
									disabled={!rowID && true}
									form={form}
									name="CustomerConsultationStatusID"
									label="Tình trạng tư vấn"
									optionList={listData.ConsultationStatus}
									isRequired={true}
								/>
							</div>
						</div>
						<div className="row mt-3">
							<div className="col-12">
								<button type="submit" className="btn btn-primary w-100">
									Lưu
									{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
})

export default StudentAdviseForm
