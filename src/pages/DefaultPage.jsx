import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import FileSchedule from '../components/FileSchedule/FileSchedule'
import Slogan from '../components/Slogan/Slogan'
import Instruction from '../components/Instruction/Instruction'
import { useNavigate } from 'react-router-dom'
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react'

const DefaultPage = ({ updateSchedule, searches }) => {
	const session = useSession()
	const supabase = useSupabaseClient()
	const { isLoading } = useSessionContext()

	let navigate = useNavigate()

	const googleSignIn = async () => {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					scopes: 'https://www.googleapis.com/auth/calendar',
				},
			})
			if (error) throw error
		} catch (error) {
			alert(error)
		}
	}

	return (
		<div className="page">
			{session ? (
				<>
					<h2>Привет {session.user.email}</h2>
					<button onClick={() => createEvent()}>Создать событие</button>
					<button onClick={() => signOut()}>Выход</button>
				</>
			) : (
				''
			)}
			<Header googleBtn={googleSignIn} updateSchedule={updateSchedule} />
			<main className="page-main">
				<h1 className="visually-hidden">SurGU Календарь - новое расписание СурГУ</h1>
				<Instruction />
				<Slogan />
				<FileSchedule searches={searches} />
			</main>
			<Footer />
		</div>
	)
}

export default DefaultPage