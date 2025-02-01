import {Button, Form, FormProps, Input} from "antd";
import {Link} from "react-router-dom";
import api from "../../api";
import {ILogin} from "../../interface";

function SignUp() {
    const onFinish: FormProps<ILogin>['onFinish'] = (values) => {
        try {
           api.post('auths/sign-up', values).then((res) => {
                console.log(res.status)
            })
        } catch (error) {
            console.log("Произошла ошибка.");
        }
    };

    return (
        <div className={'relative w-full h-[100vh] flex justify-center items-center'}>
            <img src="/loginImg.webp" alt="loginImage" className={'w-[100%] h-[100%] brightness-50'}/>
            <div className={'absolute bg-white p-[24px] rounded-lg'}>
                <p className={'text-[36px] font-[700] mb-[21px]'}>Регистрация</p>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                    autoComplete="off"
                    className={'w-[400px]'}
                >
                    <Form.Item<ILogin>
                        label="Ф.И.О"
                        name="fullName"
                        rules={[{ required: true, message: 'Введите Ф.И.О' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<ILogin>
                        label="Логин"
                        name="login"
                        rules={[{ required: true, message: 'Введите логин' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<ILogin>
                        label="Пароль"
                        name="password"
                        rules={[{ required: true, message: 'Введите пароль' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Link to={'/sign-in'} className={'block text-[#1890FF] text-[14px] font-[400] mb-5'}>Вход</Link>

                    <Form.Item className={'text-center'}>
                        <Button type="primary" htmlType="submit" className={'!bg-[#7CB305] !px-[16px] !py-[6px] !rounded-[2px]'}>
                            Регистрировать
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default SignUp;