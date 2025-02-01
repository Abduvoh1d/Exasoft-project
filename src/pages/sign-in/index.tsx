import {Button, Form, FormProps, Input} from "antd";
import {Link} from "react-router-dom";
import {ILogin} from "../../interface";
import api from "../../api";

function SignIn() {

    const onFinish: FormProps['onFinish'] = (values) => {
        try {
            api.post('auths/sign-in', values).then((res) => {
                localStorage.setItem('token', res.data);
                window.location.href = '/company';
            });
        } catch (error) {
            console.log('Failed:', error);
        }
    };

    return (
        <div className={'relative w-full h-[100vh] flex justify-center items-center'}>
            <img src="/loginImg.webp" alt="loginImage" className={'w-[100%] h-[100%] brightness-50'}/>
            <div className={'absolute bg-white p-[24px] rounded-lg'}>
                <p className={'text-[36px] font-[700] mb-[21px]'}>Вход</p>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                    autoComplete="off"
                    className={'w-[400px]'}
                >
                    <Form.Item<Omit<ILogin, "fullName">>
                        label="Логин"
                        name="login"
                        rules={[{ required: true, message: 'Введите логин' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<Omit<ILogin, "fullName">>
                        label="Пароль"
                        name="password"
                        rules={[{ required: true, message: 'Введите пароль' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Link to={'/sign-up'} className={'block text-[#1890FF] text-[14px] font-[400] mb-5'}>Регистрация</Link>

                    <Form.Item className={'text-center'}>
                        <Button type="primary" htmlType="submit" className={'!bg-[#7CB305] !px-[16px] !py-[6px] !rounded-[2px]'}>
                            Вход
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default SignIn;