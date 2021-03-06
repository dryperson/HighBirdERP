class LoginPanel extends React.PureComponent {
    constructor(props) {
        super(props);
        var initState = {
            account:'',
            password:'',
        };

        this.state = initState;
        this.panelBaseRef = React.createRef();
        autoBind(this);
    }

    componentWillMount(){
        // autolog
        this.fetching = true;
        this.setState({
            info:'尝试自动登录',
        });
        fetchJsonPosts('server', { action: 'loginUseCoockie'}, this.loginUseCookieCallBack);
    }

    logComplete(useData){
        //console.log(useData);
        LoginUser = new Account(useData);
        this.panelBaseRef.current.close();
        if(this.props.logCompleteFun != null){
            this.props.logCompleteFun();
        }
    }

    loginUseCookieCallBack(respon){
        if(respon.success){
            if(respon.json.err != null){
                this.endFetch(respon.json.err.info);
                return;
            }
            this.endFetch('成功');
            this.logComplete(respon.json.data);
        }
        else{
            this.endFetch(respon.json.err.info);
        }
    }

    accountInputChangeHandler(ev){
        this.setState({
            account:ev.target.value,
        });
    }

    passwordInputChangeHandler(ev){
        this.setState({
            password:ev.target.value,
        });
    }

    loginCallBack(respon){
        if(respon.success){
            if(respon.json.err != null){
                this.endFetch(respon.json.err.info);
                return;
            }
            this.endFetch('成功');
            this.logComplete(respon.json.data);
        }
        else{
            this.endFetch(respon.json.err.info);
        }
    }

    getPreLogDataCallBack(respon){
        if(respon.success){
            if(respon.json.err != null){
                this.endFetch(respon.json.err.info);
                return;
            }
            var rsa = forge.pki.rsa;
            //var tk = forge.pki.publicKeyToRSAPublicKey(respon.json.data);
            var usePublickKey = forge.pki.publicKeyFromPem(respon.json.data.publicKey);
            //var dstText = forge.util.encodeUtf8("12345"); 
            var encryptPass = usePublickKey.encrypt(this.usePassword);
            var encryptAccount = usePublickKey.encrypt(this.useAccount);
            fetchJsonPosts('server', { action: 'login', account:encryptAccount, password:encryptPass}, this.loginCallBack);
        }
        else{
            this.endFetch(respon.json.err.info);
        }
    }
    
    endFetch(info){
        this.fetching = false;
        this.setState({
            info:info
        });
    }

    clickConfirmHandler(){
        if(this.fetching){
            this.setState({
                info:'请稍等',
            });
            return;
        }
        this.useAccount = this.state.account.trim();
        this.usePassword = this.state.password;
        if(this.useAccount.length < 3){
            this.endFetch('账户太短');
            return;
        }
        if(this.usePassword.length < 6){
            this.endFetch('密码太短');
            return;
        }
        fetchJsonPosts('server', { action: 'getPreLogData' }, this.getPreLogDataCallBack);
        this.fetching = true;
    }

    render(){
        var passwordText = this.state.password;
        var info = IsEmptyString(this.state.info) ? '' : '(' + this.state.info + ')';
        return(
            <FloatPanelbase title='登录' ref={this.panelBaseRef} initShow={true} width={320} height={150} sizeable={false} >
                <div className='d-flex align-items-center'>
                    <i className='fa fa-user-circle fa-2x text-light' style={{width:'40px'}}  />
                    <div className='flex-grow-1 flex-shrink-1'>
                        <input type='text' className='w-100' value={this.state.account} onChange={this.accountInputChangeHandler} />
                    </div>
                </div>
                <div className='d-flex align-items-center'>
                    <i className='fa fa-lock fa-2x text-light' style={{width:'40px'}} />
                    <div className='flex-grow-1 flex-shrink-1'>
                        <input type='password' className='w-100' value={passwordText}  onChange={this.passwordInputChangeHandler} />
                    </div>
                </div>
                <button type='button' onClick={this.clickConfirmHandler} className='btn btn-dark w-100' >登录<span className='text-info'>{info}</span></button>
            </FloatPanelbase>
        );
    }
}