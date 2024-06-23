import React, { useCallback, useEffect, useState } from "react";
import { apiDeleteUser, apiGetUsers, apiUpdateUser } from "apis";
import { roles, blockStatus, sorts } from "ultils/contants";
import moment from "moment";
import { InputField, Pagination, InputForm, Select, Button } from "components";
import useDebounce from "hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import clsx from "clsx";

const ManageUser = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    email: "",
    firstname: "",
    lastname: "",
    role: "",
    phone: "",
    isBlocked: "",
  });
  const [users, setUsers] = useState(null);
  const [queries, setQueries] = useState({
    q: "",
  });
  const [editElm, setEditElm] = useState(null);
  const [params] = useSearchParams();
  const [update, setUpdate] = useState(false);
  const fetchUsers = async (params) => {
    const response = await apiGetUsers({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
      sort: "-updatedAt",
    });
    if (response.success) setUsers(response);
    // console.log(response);
  };
  const queriesDebounce = useDebounce(queries.q, 800);

  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (queriesDebounce) queries.q = queriesDebounce;
    fetchUsers(queries);
  }, [queriesDebounce, params, update]);

  const handleUpdate = async (data) => {
    const response = await apiUpdateUser(data, editElm._id);
    if (response.success) {
      setEditElm(null);
      render();
      toast.success("Thành công");
    } else toast.error("Thất bại");
  };

  const handleDeleteUser = (uid) => {
    Swal.fire({
      title: "Xác nhận...",
      text: "Bạn có chắc chắn muốn xóa tài khoản này?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiDeleteUser(uid);
        if (response.success) {
          render();
          toast.success("Xóa thành công");
        } else toast.error("Thất bại");
      }
    });
  };
  return (
    <div className={clsx("w-full", editElm && "pl-16")}>
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-[600] px-4 border-b">
        <span>Tài khoản</span>
      </h1>
      <div className="w-full p-4">
        <div className="flex justify-end py-4">
          <InputField
            nameKey={"q"}
            value={queries.q}
            setValue={setQueries}
            style={"w500"}
            placeholder="Tìm theo email, họ, tên, role..."
            isHideLabel
          />
        </div>
        <form onSubmit={handleSubmit(handleUpdate)}>
          {editElm && <Button type="submit">Update</Button>}
          <table className="table-auto mb-6 text-left w-full">
            <thead className="font-bold bg-gray-700 text-[13px] text-white">
              <tr className="border border-gray-500">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Họ</th>
                <th className="px-4 py-2">Tên</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">SDT</th>
                <th className="px-4 py-2">Ngày sửa</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {users?.users?.map((el, idx) => (
                <tr key={el._id} className="border border-gray-500">
                  <td className="py-2 px-4">{idx + 1}</td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        id={"email"}
                        validate={{
                          required: "require fill.",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "invalid email address",
                          },
                        }}
                        defaultValue={editElm?.email}
                      />
                    ) : (
                      <span>{el.email}</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        id={"firstname"}
                        validate={{ required: "require fill." }}
                        defaultValue={editElm?.firstname}
                      />
                    ) : (
                      <span>{el.lastname}</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        id={"lastname"}
                        validate={{ required: "require fill." }}
                        defaultValue={editElm?.lastname}
                      />
                    ) : (
                      <span>{el.firstname}</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <Select
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={+el.role}
                        id={"role"}
                        validate={{ required: "require fill." }}
                        options={roles}
                      />
                    ) : (
                      <span>
                        {roles.find((role) => +role.code === +el.role)?.value}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        id={"mobile"}
                        validate={{
                          required: "require fill.",
                          pattern: {
                            value: /^[84|0]+\d{9}/gi,
                            message: "invalid phone number",
                          },
                        }}
                        defaultValue={editElm?.mobile}
                      />
                    ) : (
                      <span>{el.mobile}</span>
                    )}
                  </td>
                  {/* <td className='py-2 px-4'>{editElm?._id === el._id ? <Select
                    register={register}
                    fullWidth
                    errors={errors}
                    defaultValue={el.isBlocked}
                    id={'isBlocked'}
                    validate={{ required: 'require fill.' }}
                    options={blockStatus}
                  /> : <span>{el.isBlocked ? 'Blocked' : 'Action'}</span>}</td> */}
                  <td className="py-2 px-4">
                    {moment(el.updatedAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <span
                        onClick={() => setEditElm(null)}
                        className="px-2 text-orange-600 hover:underline cursor-pointer"
                      >
                        Back
                      </span>
                    ) : (
                      <span
                        onClick={() => setEditElm(el)}
                        className="px-2 text-orange-600 hover:underline cursor-pointer"
                      >
                        Sửa
                      </span>
                    )}
                    <span
                      onClick={() => handleDeleteUser(el._id)}
                      className="px-2 text-orange-600 hover:underline cursor-pointer"
                    >
                      Xóa
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
        <div className="w-full flex justify-end">
          <Pagination totalCount={users?.counts} />
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
