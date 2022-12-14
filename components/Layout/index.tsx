import React, { ReactNode, useState } from 'react'
import Footer from './Footer'
import SideBarMobile from './Sidebar/mobile'
import Head from 'next/head'
import Header from './Header';

type Props = {
    children?: ReactNode
    title?: string
    icon?: string
}

const Layout = ({ children, title, icon }: Props) => {

    const [mobileSideMenu, setMobileSideMenu] = useState<boolean>(null)
    return (
        <div>
            <Head>
                <title>Streamcel | {title}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <div className=' bg-black-700 overflow-hidden dark:text-white-50 text-white-200   w-screen min-h-screen flex '>
                <div className='w-full h-full min-h-screen  flex  flex-col'>
                    <Header onSearch={({ q }) => console.log(q)} onSideMenuClick={() => setMobileSideMenu((mobile) => !mobile)} title={title} icon={icon} user={{ name: `john`, email: "doe" }} />
                    {mobileSideMenu ? <SideBarMobile user={{ name: `john`, email: "doe" }} /> : <div style={{ minHeight: "80vh" }} className='flex flex-col h-fit-content sm:overflow-hidden '>
                        {children}
                    </div>}
                    {!mobileSideMenu && <Footer />}


                </div>
            </div>

        </div>
    )
}

export default Layout
