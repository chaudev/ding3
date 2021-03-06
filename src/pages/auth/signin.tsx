import React, { useEffect, useState } from 'react'
import { signIn, getProviders } from 'next-auth/client'
import { useRouter } from 'next/router'
import LoginForm from '~/components/LoginForm'
import { useWrap } from '~/context/wrap'
import AuthLayout from '~/components/AuthLayout'

function SignIn({ csrfToken }) {
	const { showNoti } = useWrap()
	const router = useRouter()
	const [haveError, setHaveError] = useState('')

	useEffect(() => {
		if (router.query?.error) {
			const { error } = router.query

			const erData = error.includes('Error:') ? JSON.parse(error.toString().split('Error:')[0]) : { status: 69 }

			switch (erData?.status) {
				case 200:
					showNoti('success', 'Đăng nhập thành công')
					break
				case 400:
					showNoti('danger', 'Tên đăng nhập hoặc mật khẩu không đúng')
					setHaveError(erData.message)
					break
				case 404:
					console.log('Không truy cập được API')
					break
				case 500:
					console.log('Lỗi API')
				case 69:
					console.log(`%ERROR 69:` + `%c URL`, 'color: red; font-weight: bold', 'color: yellow;')
				default:
					console.log(JSON.stringify(erData))
					break
			}
		}
		return () => {}
	}, [])

	const _Submit = (data: any) => {
		signIn('credentials-signin', {
			...data,
			callbackUrl: (router.query?.callbackUrl as string | undefined) ?? '/',
			redirect: true
		})
	}

	return <LoginForm onSubmit={_Submit} csrfToken={csrfToken} error={haveError} />
}

SignIn.layout = AuthLayout

export default SignIn

export async function getServerSideProps(context) {
	const providers = await getProviders()
	return {
		props: { providers }
	}
}
