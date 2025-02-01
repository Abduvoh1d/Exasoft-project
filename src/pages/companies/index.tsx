import {useEffect, useState} from "react";
import {
    Button,
    Dropdown,
    Form,
    FormProps,
    Input, InputNumber,
    MenuProps,
    Modal,
    Table,
    TableProps,
} from "antd";
import {RiLogoutCircleLine} from "react-icons/ri";
import {Link} from "react-router-dom";
import {ICompany} from "../../interface";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import api from "../../api";
import {HiOutlineDotsVertical} from "react-icons/hi";
import {HiOutlinePencilSquare} from "react-icons/hi2";
import {FaRegTrashCan} from "react-icons/fa6";
import {useForm} from "antd/es/form/Form";

function Company() {
    const [form] = useForm()
    const queryClient = useQueryClient();
    const [isEdite, setIsEdite] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editeId , setEditeId] = useState<string>("");

    const {
        data: companiesData,
        isPending
    } = useQuery({
        queryKey: ["company"],
        queryFn: async () => {
            const response = await api.get<ICompany[]>(
                "companies/get-all?PageSize=10&PageIndex=1"
            );
            return response.data;
        },
        retry: 1,
    });

    const {data: oneCompany} = useQuery<ICompany>({
        queryKey: ["oneCompany", editeId],
        queryFn: async () => {
            if (!editeId) return undefined;
            const response = await api.get<ICompany>(`companies/get/${editeId}`);
            console.log(response.data)
            return response.data;
        },
        enabled: Boolean(editeId) && isEdite,
        retry: 1,
    });

    const addCompany = useMutation({
        mutationFn: (values: ICompany) => api.post("companies/add", values),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["company"]});
            closeModal()
        },
        onError: () => {
            console.log("Xatolik yuz berdi.");
        },
    });

    const editeCompany = useMutation({
        mutationFn: (values: ICompany) => api.put("companies/update", { ...values, id: editeId }),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["company"]});
            closeModal()
        },
        onError: () => {
            console.log("Xatolik yuz berdi.");
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            api.delete("companies/delete/by-id", {
                data: id,
                headers: {"Content-Type": "application/json"},
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["company"]});
        },
        onError: () => {
            console.log("Xatolik yuz berdi.");
        },
    });

    const onFinish: FormProps<ICompany>["onFinish"] = (values) => {
        if (isEdite) {
            editeCompany.mutate(values)
        } else {
            addCompany.mutate(values);
        }
    };

    function edite(id: string) {
        setEditeId(id);
        setIsEdite(true);
        setIsModalOpen(true);
    }


    const showModal = () => {
        setIsModalOpen(true);
    };

    function closeModal() {
        setIsModalOpen(false);
        form.resetFields();
    }

    useEffect(() => {
        if (oneCompany) {
            form.setFieldsValue(oneCompany);
        }
    }, [oneCompany, form]);


    // Har bir qatordagi menyuni yaratish uchun funksiya
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
                <div
                    className="flex items-center gap-2 text-[#FA2424]"
                    onClick={() => deleteMutation.mutate(id)}
                >
                    <FaRegTrashCan className="size-[16px]"/>
                    <p className="cursor-pointer text-[16px]">Удалить</p>
                </div>
            ),
        },
    ];

    // Table ustunlarini aniqlaymiz
    const columns: TableProps<ICompany>["columns"] = [
        {
            title: "Названия компании",
            dataIndex: "name",
            key: "id",
        },
        {
            title: "Количество сотрудников",
            dataIndex: "count",
            key: "id",
        },
        {
            title: "",
            render: (_, record) => (
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
            <header className="w-[100%] px-[15px] py-[21px] bg-[#313131] flex justify-between items-center">
                <p className="text-white text-[14px] font-[700]">Компании</p>
                <div className="flex items-center gap-[16px]">
                    <Link to="/sign-in">
                        <RiLogoutCircleLine
                            onClick={() => localStorage.removeItem("token")}
                            className="size-7 text-white"
                        />
                    </Link>
                    <Button
                        onClick={showModal}
                        className="!bg-[#08979C] !border-none !text-white !px-[16px] !py-[6px] !rounded-[2px]"
                    >
                        Добавить компания
                    </Button>
                </div>
            </header>

            <div className="p-[15px]">
                <Table<ICompany>
                    rowKey="id"
                    columns={columns}
                    dataSource={companiesData || []}
                    loading={isPending}
                />
            </div>

            <Modal title="Добавить компания" open={isModalOpen} onCancel={closeModal} footer={null}>
                <div className="mt-[30px]">
                    <Form
                        name="basic"
                        form={form}
                        layout="horizontal"
                        initialValues={{remember: true}}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item<ICompany>
                            label="Ф.И.О"
                            name="name"
                            rules={[{required: true, message: "Введите Ф.И.О"}]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item<ICompany>
                            label="Логин"
                            name="count"
                            rules={[{required: true, message: "Введите логин"}]}
                        >
                            <InputNumber className={'!w-[100%]'}/>
                        </Form.Item>

                        <Form.Item className="text-center">
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="!px-[16px] !py-[6px] !rounded-[2px]"
                            >
                                Регистрировать
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    );
}
export default Company;