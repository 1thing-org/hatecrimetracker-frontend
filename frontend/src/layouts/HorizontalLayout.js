// !Do not remove the Layout import
import Layout from '@layouts/HorizontalLayout'

// ** Components
// import CustomMenu from './components/Menu'
// import CustomNavbar from './components/Navbar'
// import CustomFooter from './components/Footer'

const HorizontalLayout = props => (
  <Layout
    // menu={props => <CustomMenu {...props} />}
    // navbar={props => <CustomNavbar {...props} />}
    // footer={props => <CustomFooter {...props} />}
    {...props}
  >
    {props.children}
  </Layout>
)

export default HorizontalLayout
