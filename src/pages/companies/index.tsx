import {useEffect, useState} from "react";
import {Button, Dropdown, Form, Input, InputNumber, MenuProps, Modal, Table, message} from "antd";
import {RiLogoutCircleLine} from "react-icons/ri";
import {Link} from "react-router-dom";
import {ICompany} from "../../interface";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import api from "../../api";
import {HiOutlineDotsVertical} from "react-icons/hi";
import {FaRegTrashCan} from "react-icons/fa6";
import {useForm} from "antd/es/form/Form";
import {HiOutlinePencilSquare} from "react-icons/hi2";

function Company() {
    const [form] = useForm();
    const queryClient = useQueryClient();
    const [isEdite, setIsEdite] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editeId, setEditeId] = useState<string>("");
    const [deleteId, setDeleteId] = useState<string>("");

    const {data: companiesData, isPending} = useQuery({
        queryKey: ["company"],
        queryFn: async () => {
            const response = await api.get<ICompany[]>("companies/get-all");
            return response.data;
        },
        retry: 1,
    });

    const {data: oneCompany} = useQuery<ICompany>({
        queryKey: ["oneCompany", editeId],
        queryFn: async () => {
            if (!editeId) return null;
            const response = await api.get<ICompany>(`companies/get/${editeId}`);
            return response.data;
        },
        enabled: Boolean(editeId) && isEdite,
        retry: 1,
    });

    const addCompany = useMutation({
        mutationFn: (values: ICompany) => api.post("companies/add", values, {
            headers: {"Content-Type": "application/json"},
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["company"]});
            message.success("Компания успешно добавлена");
            closeModal();
        },
        onError: () => {
            message.error("");
        },
    });

    const editeCompany = useMutation({
        mutationFn: (values: ICompany) => api.put("companies/update", {...values, id: editeId}, {
            headers: {"Content-Type": "application/json"},
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["company"]});
            closeModal();
            message.success("Компания успешно обновлена");
        },
        onError: () => {
            message.error("Ошибка при обновлении компании");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete("companies/delete/by-id", {
            data: id,
            headers: {"Content-Type": "application/json"},
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["company"]});
            setIsDeleteModalOpen(false);
            message.success("Компания успешно удалена");
        },
        onError: () => {
            message.error("Ошибка при удалении компании");
        },
    });

    const onFinish = (values: ICompany) => {
        if (isEdite) {
            editeCompany.mutate({...values, id: editeId});
        } else {
            addCompany.mutate(values);
        }
    };

    function edite(id: string) {
        setEditeId(id);
        setIsEdite(true);
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        setIsEdite(false);
        setEditeId("");
        form.resetFields();
    }

    // Delete modali uchun funksiyalar
    function openDeleteModal(id: string) {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    }

    function closeDeleteModal() {
        setIsDeleteModalOpen(false);
        setDeleteId("");
    }

    function handleDelete() {
        if (deleteId) {
            deleteMutation.mutate(deleteId);
        }
    }

    useEffect(() => {
        if (oneCompany) {
            form.setFieldsValue(oneCompany);
        }
    }, [oneCompany, form]);

    const getMenuItems = (id: string): MenuProps["items"] => [
        {
            key: "1",
            label: (
                <div className="flex items-center gap-2" onClick={() => edite(id)}>
                    <HiOutlinePencilSquare className="size-[16px]"/>
                    <p className="cursor-pointer text-[16px]">Изменить</p>
                </div>
            ),
        },
        {
            key: "2",
            label: (
                <div className="flex items-center gap-2 text-[#FA2424]" onClick={() => openDeleteModal(id)}>
                    <FaRegTrashCan className="size-[16px]"/>
                    <p className="cursor-pointer text-[16px]">Удалить</p>
                </div>
            ),
        },
    ];

    const columns = [
        {title: "Названия компании", dataIndex: "name", key: "id"},
        {title: "Количество сотрудников", dataIndex: "count", key: "id"},
        {
            title: "",
            render: (_: unknown, record: ICompany) => (
                <Dropdown
                    menu={{items: getMenuItems(record.id)}}
                    trigger={["click"]}
                    placement="bottomRight"
                    getPopupContainer={(trigger) => trigger.parentElement!}
                >
                    <div className="ant-dropdown-link">
                        <HiOutlineDotsVertical className="cursor-pointer"/>
                    </div>
                </Dropdown>
            ),
        },
    ];

    return (
        <>
            <header className="w-full px-4 py-5 bg-[#313131] flex justify-between items-center">
                <p className="text-white text-[14px] font-bold">Компании</p>
                <div className="flex items-center gap-4">
                    <Link to="/sign-in">
                        <RiLogoutCircleLine
                            onClick={() => {
                                localStorage.removeItem("token");
                                window.location.reload();
                            }}
                            className="size-7 text-white"
                        />
                    </Link>
                    <Button onClick={() => setIsModalOpen(true)} className="!bg-[#08979C] !border-none !text-white">
                        Добавить компания
                    </Button>
                </div>
            </header>

            <div className="p-4">
                <Table rowKey="id" columns={columns} dataSource={companiesData || []} loading={isPending}/>
            </div>

            <Modal title="Добавить компания" open={isModalOpen} onCancel={closeModal} footer={null}>
                <Form form={form} layout="horizontal" onFinish={onFinish} autoComplete="off">
                    <Form.Item label="Названия компании" name="name"
                               rules={[{required: true, message: "Введите название компании"}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="Количество сотрудников" name="count"
                               rules={[{required: true, message: "Введите количество сотрудников"}]}>
                        <InputNumber className="!w-full"/>
                    </Form.Item>
                    <Form.Item className="text-center">
                        <Button type="primary" htmlType="submit">Регистрировать</Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Delete uchun modal */}
            <Modal
                title="Вы хотите удалить?"
                open={isDeleteModalOpen}
                onCancel={closeDeleteModal}
                footer={[
                    <Button key="cancel" onClick={closeDeleteModal}>
                        Отмена
                    </Button>,
                    <Button key="delete" danger onClick={handleDelete}>
                        Удалить
                    </Button>,
                ]}
            >
            </Modal>
        </>
    );
}

export default Company;