import { ROUTES } from '@app/config'
import {
	AuthProvider,
	ProtectedRoute,
	PublicRoute,
	QueryProvider,
	RouterProvider,
} from '@app/providers'
import { LoginPage, RegisterPage } from '@pages/auth'
import { MainPage } from '@pages/main'
import { Navigate, Route } from 'react-router'

function App() {
	return (
		<QueryProvider>
			<AuthProvider>
				<RouterProvider>
					{/* private routes */}
					<Route element={<ProtectedRoute />}>
						<Route path="/" element={<Navigate to={ROUTES.main} replace />} />
						<Route path={ROUTES.main} element={<MainPage />} />
					</Route>

					{/* public routes */}
					<Route element={<PublicRoute />}>
						<Route path={ROUTES.login} element={<LoginPage />} />
						<Route path={ROUTES.register} element={<RegisterPage />} />
					</Route>

					{/* 404 */}
					<Route path="*" element={<Navigate to={ROUTES.main} replace />} />
				</RouterProvider>
			</AuthProvider>
		</QueryProvider>
	)
}

export default App
