import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Popover } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Filter } from 'react-feather'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import DateField from '~/components/FormControl/DateField'

const TeacherFilterForm = (props) => {
	const { handleFilter, handleResetFilter } = props

	const [showFilter, showFilterSet] = useState(false)

	const funcShowFilter = () => {
		showFilterSet(!showFilter)
	}

	const schema = yup.object().shape({
		fromDate: yup.date().required('Bạn không được để trống'),
		toDate: yup
			.date()
			.required('Bạn không được để trống')
			.when('fromDate', (startDate, schema) => startDate && schema.min(startDate, `Ngày không hợp lệ`))
	})

	const defaultValuesInit = {
		fromDate: undefined, // moment().format('YYYY/MM/DD') DATE NOW
		toDate: undefined // moment().add(1, "months").format("YYYY/MM/DD") DATE NOW + 1
	}

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	})

	const checkHandleFilter = (createdBy) => {
		if (!handleFilter) return
		handleFilter(createdBy)
		funcShowFilter()
	}

	const checkHandleResetFilter = () => {
		if (!handleResetFilter) return
		handleResetFilter()
		funcShowFilter()
		form.reset({
			fromDate: undefined,
			toDate: undefined
		})
	}

	const content = (
		<div className={`wrap-filter small`}>
			<Form layout="vertical" onFinish={form.handleSubmit(checkHandleFilter)}>
				<div className="row">
					<div className="col-md-12">
						<DateField form={form} name="fromDate" label="Ngày nhận việc từ" placeholder="Chọn ngày" />
					</div>
					<div className="col-md-12">
						<DateField form={form} name="toDate" label="Đến ngày" placeholder="Chọn ngày" />
					</div>
					<div className="col-md-12 mt-3">
						<button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>
							Tìm kiếm
						</button>
						<button type="button" className="light btn btn-secondary" onClick={checkHandleResetFilter}>
							Reset
						</button>
					</div>
				</div>
			</Form>
		</div>
	)

	return (
		<>
			<div className="wrap-filter-parent">
				<Popover
					placement="bottomRight"
					content={content}
					trigger="click"
					visible={showFilter}
					onVisibleChange={funcShowFilter}
					overlayClassName="filter-popover"
				>
					<button className="btn btn-secondary light btn-filter">
						<Filter />
					</button>
				</Popover>
			</div>
		</>
	)
}

TeacherFilterForm.propTypes = {
	handleFilter: PropTypes.func,
	handleResetFilter: PropTypes.func
}
TeacherFilterForm.defaultProps = {
	handleFilter: null,
	handleResetFilter: null
}
export default TeacherFilterForm
