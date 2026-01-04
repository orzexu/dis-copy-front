type Props = {
	type?: 'vertical' | 'horizontal'
}

export const Divider: React.FC<Props> = ({ type = 'horizontal' }) => {
	return <div className={`${type === 'horizontal' ? 'w-full my-1 h-px bg-zinc-700' : 'w-px mx-0.5 h-full bg-zinc-700'}`} />
}
