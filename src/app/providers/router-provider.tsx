import { BrowserRouter, Routes } from 'react-router'

type Props = {
	children: React.ReactNode
}

export const RouterProvider: React.FC<Props> = ({ children }) => {
	return (
		<BrowserRouter>
			<Routes>
        {children}
      </Routes>
		</BrowserRouter>
	)
}
