import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import FileSchedule from '../components/FileSchedule/FileSchedule'
import Slogan from '../components/Slogan/Slogan'
import Instruction from '../components/Instruction/Instruction'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Container, Heading } from '@chakra-ui/react'
import FormAdmin from '../components/FormAdmin/FormAdmin'

const AdminPage = () => {
	return (
		<div className="page">
			<Header />
			<Container maxW="1820px" my={-6}>
				<Heading fontSize="38px" color={'#484848'} fontWeight={500}>
					Добро пожаловать в админ-панель
				</Heading>
			</Container>
			<main className="page-main page-admin">
				<h1 className="visually-hidden">SurGU Календарь - новое расписание СурГУ</h1>
				<Tabs isFitted variant="enclosed" colorScheme="blue" defaultIndex={3}>
					<TabList mb="1em">
						<Tab>Настройка расписания</Tab>
						<Tab>Добавление расписаний</Tab>
						<Tab>Добавление переносов</Tab>
						<Tab>Редактирование ролей</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<p>Настройка расписания</p>
						</TabPanel>
						<TabPanel>
							<p>Добавление расписаний</p>
						</TabPanel>
						<TabPanel>
							<p>Добавление переносов</p>
						</TabPanel>
						<TabPanel>
							<FormAdmin />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</main>
			<Footer />
		</div>
	)
}

export default AdminPage
