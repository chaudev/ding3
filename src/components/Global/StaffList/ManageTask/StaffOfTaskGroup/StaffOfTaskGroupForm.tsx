import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Modal, Spin, Table, Tooltip } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { UserPlus } from "react-feather";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import DeleteTableRow from "~/components/Elements/DeleteTableRow/DeleteTableRow";
import CheckboxField from "~/components/FormControl/CheckboxField";
import SelectField from "~/components/FormControl/SelectField";
import { optionCommonPropTypes } from "~/utils/proptypes";

StaffOfTaskGroupForm.propTypes = {
  isLoading: PropTypes.shape({
    type: PropTypes.string.isRequired,
    status: PropTypes.bool.isRequired,
  }),
  handleFetchStaffListByRole: PropTypes.func,
  handleFetchStaffOfTaskGroup: PropTypes.func,
  handleFetchTask: PropTypes.func,
  handleSubmit: PropTypes.func,
  handleDeleteStaffOfTaskGroup: PropTypes.func,
  optionRoleList: optionCommonPropTypes,
  optionStaffList: optionCommonPropTypes,
  optionTaskList: optionCommonPropTypes,
  staffOfTaskGroup: PropTypes.arrayOf(
    PropTypes.shape({
      ID: PropTypes.number,
      TaskGroupID: PropTypes.number,
      TaskGroupName: PropTypes.string,
      StaffID: PropTypes.number,
      StaffName: PropTypes.string,
      RoleID: PropTypes.number,
      RoleName: PropTypes.string,
    })
  ),
};
StaffOfTaskGroupForm.defaultProps = {
  isLoading: { type: "", status: false },
  handleFetchStaffListByRole: null,
  handleFetchStaffOfTaskGroup: null,
  handleFetchTask: null,
  handleSubmit: null,
  handleDeleteStaffOfTaskGroup: null,
  optionRoleList: [],
  optionStaffList: [],
  optionTaskList: [],
  staffOfTaskGroup: [],
};
function StaffOfTaskGroupForm(props) {
  const {
    isLoading,
    handleFetchStaffListByRole,
    handleFetchStaffOfTaskGroup,
    handleFetchTask,
    handleSubmit,
    handleDeleteStaffOfTaskGroup,
    optionRoleList,
    optionStaffList,
    optionTaskList,
    staffOfTaskGroup,
  } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showMoreField, setShowMoreField] = useState(false);
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const schema = yup.object().shape({
    RoleID: yup.number().nullable().required("B???n kh??ng ???????c ????? tr???ng"),
    StaffID: yup.number().nullable().required("B???n kh??ng ???????c ????? tr???ng"),
    isAddTask: yup.bool(),
    TaskID: yup
      .number()
      .notRequired()
      .when("isAddTask", (isAddTask, schema) => {
        if (isAddTask) {
          return yup.number().nullable().required(`B???n kh??ng ???????c ????? tr???ng`);
        }
        return yup.number().nullable().notRequired();
      }),
  });

  const defaultValuesInit = {
    RoleID: null,
    StaffID: null,
    isAddTask: false,
    TaskID: null,
  };

  const form = useForm({
    defaultValues: defaultValuesInit,
    resolver: yupResolver(schema),
  });

  const checkHandleFetchStaffListByRole = (id: number) => {
    if (!handleFetchStaffListByRole) return;
    form.setValue("StaffID", null);
    handleFetchStaffListByRole(id);
  };
  const checkHandleFetchStaffOfTaskGroup = () => {
    if (!handleFetchStaffOfTaskGroup) return;
    handleFetchStaffOfTaskGroup();
  };
  const checkHandleFetchTask = () => {
    if (!handleFetchTask) return;
    handleFetchTask();
  };

  const checkHandleSubmit = (data) => {
    if (!handleSubmit) return;
    handleSubmit(data).then((res) => {
      if (res) {
        form.reset({ ...defaultValuesInit });
        setShowMoreField(false);
      }
    });
  };

  const checkHandleDeleteStaffOfTaskGroup = (idx: number) => {
    if (!handleDeleteStaffOfTaskGroup) return;
    return handleDeleteStaffOfTaskGroup(idx);
  };

  useEffect(() => {
    form.clearErrors();
    isModalVisible && checkHandleFetchStaffOfTaskGroup();
  }, [isModalVisible]);

  const columns = [
    {
      title: "T??n nh??n vi??n",
      dataIndex: "StaffName",
    },
    {
      title: "Ch???c v???",
      dataIndex: "RoleName",
    },
    {
      align: "center" as "center",
      render: (value: IStaffOfTaskGroup, _, idx) => (
        <div onClick={(e) => e.stopPropagation()}>
          <DeleteTableRow
            handleDelete={checkHandleDeleteStaffOfTaskGroup(idx)}
          />
        </div>
      ),
    },
  ];
  return (
    <>
      <button className="btn btn-icon add" onClick={openModal}>
        <Tooltip title="Th??m nh??n vi??n">
          <UserPlus />
        </Tooltip>
      </button>
      <Modal
        title={`Th??m nh??n vi??n`}
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
        className="staff-task-group-modal"
      >
        <div>
          <Form
            key="1"
            layout="vertical"
            onFinish={form.handleSubmit(checkHandleSubmit)}
          >
            <div className="row">
              <div className="col-6">
                <SelectField
                  style={{ marginBottom: "12px" }}
                  form={form}
                  name="RoleID"
                  optionList={optionRoleList}
                  label="Ch???c v???"
                  placeholder="Ch???n ch???c v???"
                  onChangeSelect={checkHandleFetchStaffListByRole}
                />
              </div>
              <div className="col-6">
                <SelectField
                  style={{ marginBottom: "12px" }}
                  form={form}
                  name="StaffID"
                  optionList={optionStaffList}
                  label="Nh??n vi??n"
                  placeholder="Ch???n nh??n vi??n"
                  isLoading={
                    isLoading.type === "FETCH_STAFF" && isLoading.status
                  }
                />
              </div>
            </div>
            {showMoreField && (
              <div className="row">
                <div className="col-12">
                  <SelectField
                    style={{ marginBottom: "12px" }}
                    form={form}
                    name="TaskID"
                    optionList={optionTaskList}
                    label="Task"
                    placeholder="Ch???n task"
                    isLoading={
                      isLoading.type === "FETCH_TASK" && isLoading.status
                    }
                  />
                </div>
              </div>
            )}
            <div className="row">
              <div className="col-12">
                <CheckboxField
                  form={form}
                  name="isAddTask"
                  text="Th??m task"
                  handleChangeCheckbox={(vl) => {
                    if (vl) {
                      checkHandleFetchTask();
                    }
                    setShowMoreField(vl);
                  }}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <Form.Item label="Danh s??ch nh??n vi??n">
                  <div className="wrap-table">
                    <Table
                      loading={isLoading.type === "GET_ALL" && isLoading.status}
                      dataSource={staffOfTaskGroup}
                      columns={columns}
                      size="middle"
                      pagination={{ pageSize: 5 }}
                    />
                  </div>
                </Form.Item>
              </div>
            </div>
            <div className="row ">
              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isLoading.type == "ADD_DATA" && isLoading.status}
                >
                  Add
                  {isLoading.type == "ADD_DATA" && isLoading.status && (
                    <Spin className="loading-base" />
                  )}
                </button>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
}

export default StaffOfTaskGroupForm;
