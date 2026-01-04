type Props = {
	children: React.ReactNode
}

export const AuthContainer: React.FC<Props> = ({ children }) => {
	return (
    <div className="flex justify-center items-center h-screen">
      {children}
    </div>
  )
}
