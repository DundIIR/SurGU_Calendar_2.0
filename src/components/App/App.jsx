import { Route, Routes, Navigate } from 'react-router-dom'
import { DefaultPage, HomePage } from '../../pages'
import { useEffect, useState } from 'react'
import { useSession, useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react'

const App = () => {
	const session = useSession()
	const { isLoading } = useSessionContext()

	const [searches, setSearches] = useState([])

	const updateSchedule = () => {
		const storedSearches = JSON.parse(localStorage.getItem('searches')) || []
		setSearches(storedSearches)
	}

	useEffect(() => {
		updateSchedule()
	}, [])

	if (isLoading) {
		return ''
	}

	return (
		<Routes>
			<Route
				path="/"
				element={
					session ? (
						<Navigate to="/home" />
					) : (
						<DefaultPage updateSchedule={updateSchedule} searches={searches} setSearches={setSearches} />
					)
				}
			/>
			<Route
				path="/home"
				element={
					session ? (
						<HomePage updateSchedule={updateSchedule} searches={searches} setSearches={setSearches} />
					) : (
						<Navigate to="/" />
					)
				}
			/>
		</Routes>
	)
}

export default App
