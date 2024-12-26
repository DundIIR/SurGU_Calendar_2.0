import { useSession } from '@supabase/auth-helpers-react'
import './_formAdmin.scss'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Box, Stack, Input, Select, Button, List, ListItem, Text, Heading, VStack, useToast } from '@chakra-ui/react'
import SurguCalendarAPI from '../../services/SurguCalendarAPI'

const fetchUsers = async () => {
	return [
		{ id: '1', email: 'ruzim@uands.ru', role: 'Студент' },
		{ id: '2', email: 'rels@uands.ru', role: 'Администратор' },
		{ id: '3', email: 'johndoe@example.com', role: 'Студент' },
		{ id: '4', email: 'janedoe@example.com', role: 'Преподаватель' },
		{ id: '5', email: 'mike.brown@example.com', role: 'Администратор' },
		{ id: '6', email: 'sara.white@example.com', role: 'Студент' },
		{ id: '7', email: 'tom.hanks@example.com', role: 'Преподаватель' },
		{ id: '8', email: 'lisa.kim@example.com', role: 'Староста' },
		{ id: '9', email: 'alex.green@example.com', role: 'Студент' },
		{ id: '10', email: 'emma.watson@example.com', role: 'Преподаватель' },
		{ id: '11', email: 'charlie.blue@example.com', role: 'Студент' },
		{ id: '12', email: 'olivia.purple@example.com', role: 'Администратор' },
		{ id: '13', email: 'daniel.red@example.com', role: 'Студент' },
		{ id: '14', email: 'amelia.yellow@example.com', role: 'Преподаватель' },
		{ id: '15', email: 'jacob.gray@example.com', role: 'Студент' },
		{ id: '16', email: 'isabella.orange@example.com', role: 'Староста' },
		{ id: '17', email: 'michael.pink@example.com', role: 'Преподаватель' },
		{ id: '18', email: 'ava.brown@example.com', role: 'Администратор' },
		{ id: '19', email: 'william.black@example.com', role: 'Студент' },
		{ id: '20', email: 'sophia.gold@example.com', role: 'Преподаватель' },
		{ id: '21', email: 'james.silver@example.com', role: 'Староста' },
		{ id: '22', email: 'ella.turquoise@example.com', role: 'Администратор' },
		{ id: '23', email: 'henry.violet@example.com', role: 'Студент' },
		{ id: '24', email: 'mia.indigo@example.com', role: 'Преподаватель' },
		{ id: '25', email: 'lucas.lime@example.com', role: 'Староста' },
	]
}

const FormAdmin = () => {
	const session = useSession()
	const [users, setUsers] = useState([])
	const [filteredUsers, setFilteredUsers] = useState([])
	const [search, setSearch] = useState('')
	const [selectedRole, setSelectedRole] = useState('')
	const toast = useToast()
	const surguCalendarAPI = new SurguCalendarAPI()

	useEffect(() => {
		const loadUsers = async () => {
			const data = await surguCalendarAPI.getUsersList(session.access_token)
			setUsers(data)
			setFilteredUsers(data)
		}
		loadUsers()
	}, [])

	useEffect(() => {
		const filtered = users.filter(user => user.email.toLowerCase().includes(search.toLowerCase()))
		setFilteredUsers(filtered)
	}, [search, users])

	const handleSelectUser = user => {
		setSearch(user.email)
		setSelectedRole(user.role)
	}

	const handleSave = () => {
		const matchedUser = users.find(user => user.email === search)
		if (!matchedUser) {
			toast({
				title: 'Ошибка',
				description: 'Введена неверная почта. Пожалуйста, выберите пользователя из списка.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			})
			return
		}
		surguCalendarAPI.updateUserRole(session.access_token, search, selectedRole)
	}

	return (
		<Box w="100%" h="100%" mx="auto" p={5} borderWidth="1px" borderRadius="lg" className="page-main__instruction">
			<VStack spacing={4} align="start">
				<Heading fontSize="24px" color={'#484848'} fontWeight={500}>
					Смена роли для пользователей
				</Heading>
				<Stack direction="row" spacing={4} align="center" w="100%">
					<Input placeholder="Введите почту для поиска" value={search} onChange={e => setSearch(e.target.value)} />
					<Select placeholder="Выберите роль" value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
						<option value="Администратор">Администратор</option>
						<option value="Студент">Студент</option>
						<option value="Преподаватель">Преподаватель</option>
						<option value="Староста">Староста</option>
					</Select>
				</Stack>
				<Box border="1px solid" borderColor="gray.200" borderRadius="md" h="200px" w="100%" pr="10px">
					<List overflowY="scroll" h="100%" className="custom-scrollbar" pr="10px">
						{filteredUsers.map(user => (
							<ListItem
								key={user.id}
								p={2}
								cursor="pointer"
								_hover={{ backgroundColor: 'gray.100' }}
								onClick={() => handleSelectUser(user)}>
								<Text>{user.email}</Text>
							</ListItem>
						))}
					</List>
				</Box>
				<Button colorScheme="blue" isDisabled={!search || !selectedRole} onClick={handleSave}>
					Сохранить
				</Button>
			</VStack>
		</Box>
	)
}

export default FormAdmin
