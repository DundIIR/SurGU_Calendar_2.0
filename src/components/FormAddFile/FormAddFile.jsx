import { useSession } from '@supabase/auth-helpers-react'
import './_formAdmin.scss'
import { useState, useEffect } from 'react'
import axios from 'axios'
import {
	Box,
	Stack,
	Input,
	Select,
	Button,
	List,
	ListItem,
	Text,
	Heading,
	VStack,
	useToast,
} from '@chakra-ui/react'
import SurguCalendarAPI from '../../services/SurguCalendarAPI'

const FormRole = () => {
	const session = useSession()
	const [users, setUsers] = useState([])
	const [filteredUsers, setFilteredUsers] = useState([])
	const [search, setSearch] = useState('')
	const [selectedRole, setSelectedRole] = useState('')
	const toast = useToast()
	const surguCalendarAPI = new SurguCalendarAPI()

	return (
		<Box
			w='100%'
			h='100%'
			mx='auto'
			p={5}
			borderWidth='1px'
			borderRadius='lg'
			className='page-main__instruction'
		>
			<VStack spacing={4} align='start'>
				<Heading fontSize='24px' color={'#484848'} fontWeight={500}>
					Смена роли для пользователей
				</Heading>
				<Stack direction='row' spacing={4} align='center' w='100%'>
					<Input
						placeholder='Введите почту для поиска'
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
					<Select
						placeholder='Выберите роль'
						value={selectedRole}
						onChange={e => setSelectedRole(e.target.value)}
					>
						<option value='Администратор'>Администратор</option>
						<option value='Студент'>Студент</option>
						<option value='Преподаватель'>Преподаватель</option>
						<option value='Староста'>Староста</option>
					</Select>
				</Stack>
				<Box
					border='1px solid'
					borderColor='gray.200'
					borderRadius='md'
					h='200px'
					w='100%'
					pr='10px'
				>
					<List
						overflowY='scroll'
						h='100%'
						className='custom-scrollbar'
						pr='10px'
					>
						{filteredUsers.map(user => (
							<ListItem
								key={user.id}
								p={2}
								cursor='pointer'
								_hover={{ backgroundColor: 'gray.100' }}
								onClick={() => handleSelectUser(user)}
							>
								<Text>{user.email}</Text>
							</ListItem>
						))}
					</List>
				</Box>
				<Button
					colorScheme='blue'
					isDisabled={!search || !selectedRole}
					onClick={handleSave}
				>
					Сохранить
				</Button>
			</VStack>
		</Box>
	)
}

export default FormRole
