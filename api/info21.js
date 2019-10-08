const puppeteer = require("puppeteer")

exports.Info21 = (req, res) => {
    console.log("Info21 Auth Request")
    
    const info_id = req.body.info_id
    const info_pw = req.body.info_pw
    
    const doLogin = async () => {
        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sanbox',
                    '--disable-setuid-sanbox',
                ]
            })
            const page = await browser.newPage()
    
            const userId = info_id
            const userPw = info_pw
    
            await page.goto("https://info21.khu.ac.kr/com/LoginCtr/login.do?sso=ok")
    
            await page.click('body > div:nth-child(10) > div.ui-dialog-titlebar.ui-corner-all.ui-widget-header.ui-helper-clearfix.ui-draggable-handle > button')
    
            await page.evaluate((id, pw) => {
                document.querySelector('input[name="userId"]').value = id
                document.querySelector('input[name="userPw"]').value = pw
            }, userId, userPw)
    
            await page.click("#loginFrm > div > div.wrap > div.login_box > div.m_box.idx02.fr > button") 
    
            await page.waitFor(5000)
    
            await console.log(page.url())

            if (await page.url() == "https://portal.khu.ac.kr/") {
                await page.goto('https://portal.khu.ac.kr/haksa/sknr/sknr/skUp/index.do')
    
                const elemName = await page.$('body > div.container > div > section > div.h3_box > div.user_data > ul > li:nth-child(3)')
                txtName = await page.evaluate(elemName => elemName.textContent, elemName)
        
                const elemNumId = await page.$('body > div.container > div > section > div.h3_box > div.user_data > ul > li:nth-child(2)')
                txtNumId = await page.evaluate(elemNumId => elemNumId.textContent, elemNumId)
        
                const elemDept = await page.$('body > div.container > div > section > div.h3_box > div.user_data > ul > li:nth-child(5)')
                txtDept = await page.evaluate(elemDept => elemDept.textContent, elemDept)
        
                await console.log(txtName)
                await console.log(txtNumId)
                await console.log(txtDept)
        
                await browser.close()
    
                const result = await txtName + ", " + txtNumId + ", " + txtDept
    
                return await Promise.resolve(result)
            } else {
                return await Promise.reject({
                    code: "login_failed",
                    message: "Wrong Id or Password"
                })
            }
        } catch (err) {
            return Promise.reject(err)
        }
    }
    
    doLogin()
    .then(result => {
        res.send(result)
        res.end()
    })
    .catch(err => {
        console.log(err)
        res.send("fail")
        res.end()
    })
}