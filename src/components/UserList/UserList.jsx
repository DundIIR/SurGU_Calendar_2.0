import { useSession } from '@supabase/auth-helpers-react'
import './_userList.scss'

const UserList = ({ googleBtn }) => {
	const session = useSession()

	return (
		<div className="user-list">
			<button className="user-list__btn" onClick={e => googleBtn(e)}>
				<span className="visually-hidden">Войти</span>
				{session ? (
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M7.35294 16.6V18.7C7.35294 19.257 7.57605 19.7911 7.97319 20.1849C8.37032 20.5788 8.90895 20.8 9.47059 20.8H16.8824C17.444 20.8 17.9826 20.5788 18.3798 20.1849C18.7769 19.7911 19 19.257 19 18.7L19 6.1C19 5.54305 18.7769 5.0089 18.3798 4.61508C17.9826 4.22125 17.444 4 16.8824 4L9.47059 4C8.90895 4 8.37032 4.22125 7.97319 4.61508C7.57605 5.0089 7.35294 5.54305 7.35294 6.1V8.2M13.7059 12.4L1 12.4M1 12.4L4.17647 15.55M1 12.4L4.17647 9.25"
							stroke="#1143C0"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				) : (
					<svg width="22.4" height="22.4" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M2 24.4L2.00047 20.1995C2.00073 17.8801 3.88106 16 6.20047 16H13.2M16 6.2C16 8.5196 14.1196 10.4 11.8 10.4C9.4804 10.4 7.6 8.5196 7.6 6.2C7.6 3.8804 9.4804 2 11.8 2C14.1196 2 16 3.8804 16 6.2Z"
							stroke="#1143C0"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M19.6987 20.5499L16.6987 17.75M16.6987 17.75L19.6987 14.95M16.6987 17.75H24.3987"
							stroke="#0D9739"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				)}
			</button>
		</div>
	)
}

export default UserList
