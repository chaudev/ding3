import { List } from 'antd'
import moment from 'moment'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { cloneElement } from 'react'
import { useWrap } from '~/context/wrap'
import { numberWithCommas } from '~/utils/functions'

const PowerList = (props) => {
	const { dataSource, isLoading, totalPage, currentPage, getPagination, children } = props
	const { userInformation } = useWrap()
	const checkGetPagination = (page) => {
		if (!getPagination) return
		getPagination(page)
	}
	const checkStatus = (vl, ctn, Avatar) => {
		const rs = ['yellow', 'green', 'gray']
		return (
			<div className="">
				<span className={`tag ${rs[vl]}`} style={{ width: '100%', textAlign: 'center' }}>
					{ctn}
				</span>

				<img
					style={{ width: 100, height: 100, borderRadius: 10, marginTop: 5, objectFit:'contain' }}
					src={Avatar !== null && Avatar !== undefined && Avatar !== '' ? Avatar : '/images/study01.png'}
					alt="logo course img"
				/>
			</div>
		)
	}

	const returnPathName = (ID, TypeCourse, CourseName) => {
		if (!userInformation) return ''
		let role = userInformation?.RoleID
		let path = null

		if (role == 1 || role == 5) {
			path = {
				pathname: '/course/course-list/course-list-detail/[slug]',
				query: { slug: ID, type: TypeCourse, CourseName }
			}
		} else {
			path = {
				// pathname: '/customer/student/lesson-detail',
				pathname: '/course/course-list/course-list-detail/[slug]',
				query: { slug: ID, courseID: ID, CourseName }
			}
		}

		return path
	}

	return (
		<List
			loading={isLoading?.type === 'GET_ALL' && isLoading?.status}
			pagination={{
				onChange: checkGetPagination,
				total: totalPage,
				size: 'small',
				current: currentPage
			}}
			itemLayout="horizontal"
			dataSource={dataSource}
			renderItem={({
				ID,
				Status,
				StatusName,
				CourseName,
				AcademicName,
				AcademicUID,
				TeacherLeaderName,
				TeacherLeaderUID,
				TeacherName,
				Price,
				TotalDays,
				StartDay,
				EndDay,
				TotalStudents,
				TypeCourse,
				TypeCourseName,
				BranchID,
				MaximumStudent,
				SalaryOfLesson,
				Avatar
			}: ICourse) => (
				<List.Item
					extra={cloneElement(children, {
						courseObj: { ID, BranchID, AcademicUID, TeacherLeaderUID, SalaryOfLesson }
					})}
				>
					<List.Item.Meta
						avatar={checkStatus(Status, StatusName, Avatar)}
						title={
							<Link href={returnPathName(ID, TypeCourse, CourseName)}>
								<a>{CourseName}</a>
							</Link>
						}
						description={
							<div className="content-body">
								<ul className="list-ver">
									<li>
										<span>Qu???n l??: </span> <span>{TeacherLeaderName || 'Tr???ng'}</span>
									</li>
									<li>
										<span>Gi??o vi??n: </span> <span>{TeacherName || 'Tr???ng'}</span>
									</li>
									<li>
										<span>H??nh th???c: </span> <span>{TypeCourseName || 'Tr???ng'}</span>
									</li>
									<li>
										<span>H???c ph??: </span> <span>{numberWithCommas(Price)} VN??</span>
									</li>
									{userInformation?.RoleID === 1 && (
										<li>
											<span>L????ng/Bu???i: </span> <span>{numberWithCommas(SalaryOfLesson)} VN??</span>
										</li>
									)}
								</ul>
								<ul className="list-hor">
									<li>
										S??? bu???i h???c: <span>{TotalDays}</span>
									</li>
									<li>
										Khai gi???ng: <span>{moment(StartDay).format('DD/MM/YYYY')}</span>
									</li>
									<li>
										B??? gi???ng: <span>{moment(EndDay).format('DD/MM/YYYY')}</span>
									</li>
									<li>
										S??? h???c vi??n: <span>{TotalStudents}</span>
									</li>
									{MaximumStudent && (
										<li>
											S??? h???c vi??n t???i ??a: <span>{MaximumStudent}</span>
										</li>
									)}
								</ul>
							</div>
						}
					/>
				</List.Item>
			)}
		/>
	)
}

PowerList.propTypes = {
	dataSource: PropTypes.array.isRequired,
	totalPage: PropTypes.number,
	currentPage: PropTypes.number,
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	children: PropTypes.element,
	//
	getPagination: PropTypes.func
}
PowerList.defaultProps = {
	totalPage: 1,
	currentPage: 1,
	isLoading: { type: '', status: false },
	getPagination: null
}

export default PowerList
