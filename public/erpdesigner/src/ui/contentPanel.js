class ContentPanel extends React.PureComponent {
    constructor(props) {
        super(props);

        var project = this.props.project;
        var editingPage = project.getEditingPage();
        var initState = {
            isPC: this.props.project.designeConfig.editingType == 'PC',
            title: this.props.project.getAttribute('title'),
            editingPage: editingPage,
        };
        this.state = initState;

        this.watchedAttrs = ['title', 'editingType', 'editingPage'];
        this.pageCtlRef = React.createRef();

        autoBind(this);
    }

    toggleProjectEditingType() {
        this.props.project.toggleEditingType();
    }

    attrChangedHandler(ev) {
        var needFresh = false;
        var changedAttrIndex = -1;
        if (typeof ev.name === 'string') {
            changedAttrIndex = this.watchedAttrs.indexOf(ev.name);
            needFresh = changedAttrIndex != -1;
        }
        else {
            needFresh = ev.name.find(
                attrName => {
                    changedAttrIndex = this.watchedAttrs.indexOf(attrName);
                    return changedAttrIndex != -1;
                }
            ) != null;
        }
        if (needFresh) {
            var newEditingPage = this.props.project.getEditingPage();
            var changedAttrName = this.watchedAttrs[changedAttrIndex];
            this.setState({
                isPC: this.props.project.designeConfig.editingType == 'PC',
                title: this.props.project.getAttribute('title'),
                editingPage: newEditingPage,
            });
            //console.log('changedAttrName:' + changedAttrName);
            if (changedAttrName == 'editingPage' && this.props.project.designer.attributePanel) {
                this.props.project.designer.attributePanel.setTarget(newEditingPage);
            }
        }
    }

    componentWillMount() {
        this.props.project.on(EATTRCHANGED, this.attrChangedHandler);
    }

    componentWillUnmount() {
        this.props.project.off(EATTRCHANGED, this.attrChangedHandler);
    }

    renderEditingPage(project, editingPage, isPC) {
        if (editingPage == null)
            return null;
        if (isPC) {
            return null;
        }
        else {
            return (
                <div id='pageContainer' className='bg-light d-flex flex-column m-4 border border-primary flex-grow-0 flex-shrink-1 mobilePage rounded' >
                    <M_Page project={project} ctlKernel={editingPage} isPC={isPC} ref={this.pageCtlRef} />
                </div>
            );
        }
    }

    changeEditingPageBtnClickHandler(ev) {
        var target = ev.target;
        var targetPageName = target.getAttribute('pagename');
        this.props.project.setEditingPageByName(targetPageName);
    }

    clickProjSettingBtnHandler(ev) {
        if (this.props.project.designer.attributePanel) {
            this.props.project.designer.attributePanel.setTarget(this.props.project);
        }
    }

    clickContentDivHander(ev) {
        var tNode = ev.target;
        var found = false;
        do {
            if (tNode.hasAttribute('id') && tNode.getAttribute('id') == 'pageContainer') {
                found = true;
                break;
            }
            tNode = tNode.parentNode;
        } while (tNode && tNode != document.body);
        if (found) {
            return;
        }
        if (this.props.project.designer.attributePanel && this.state.editingPage) {
            this.props.project.designer.attributePanel.setTarget(this.state.editingPage);
        }
    }

    startPlace(ctlKernel) {
        this.placingKernel = ctlKernel;
    }

    endPlace(){
        if(this.placingKernel){
            this.placingKernel.__placing = false;
            if(this.placingKernel.parent){
                this.placingKernel.fireForceRender();
                this.props.project.designer.selectKernel(this.placingKernel);
            }
            else{
                console.log('reback');
            }
            this.placingKernel = null;
        }
    }

    placePosChanged(newPos){
        this.pageCtlRef.current.tryPlaceKernel(this.placingKernel,newPos);
        //var $rootDiv = $(this.pageCtlRef.current);
        //console.log($thisDiv);
        //console.log(newPos);
        //console.log($rootDiv.position());
        //console.log(this.pageCtlRef.current.getBoundingClientRect());
    }

    clickPanelNameBtn(ev){
        this.props.wantOpenPanel(getAttributeByNode(ev.target, 'pname', true, 3));
    }

    render() {
        var project = this.props.project;
        var isPC = this.state.isPC;
        var editingPage = this.state.editingPage;
        return (
            <div className='flex-grow-1 flex-shrink-1 d-flex flex-column'>
                <div className='flex-grow-0 flex-shrink-1 d-flex bg-secondary projectContentHeader align-items-center'>
                    <div className='flex-grow-1 flex-shrink-1 d-flex justify-content-center align-items-center text-light'>
                        <h4 >{this.state.title}

                        </h4>
                        <button type='button' onClick={this.clickProjSettingBtnHandler} className='btn btn-sm icon icon-gear bg-secondary ml-1' />
                        <button type="button" className={"ml-1 p-0 btn btn-secondary dropdown-toggle dropdown-toggle-split"} data-toggle="dropdown">
                            <div className={"badge badge-pill ml-1 badge-" + (isPC ? "danger" : "success")}>
                                {isPC ? "电脑版" : "手机版"}
                            </div>
                        </button>
                        <div className="dropdown-menu">
                            <button onClick={this.toggleProjectEditingType} className="dropdown-item" type="button">{isPC ? '切换手机版' : '切换电脑版'}</button>
                        </div>
                    </div>
                    <div className='flex-grow-0 flex-shrink-1'>
                        <button type="button" className={"p-0 btn btn-secondary dropdown-toggle"} data-toggle="dropdown">
                            {editingPage ? editingPage.title : '暂无页面'}
                        </button>
                        <div className="dropdown-menu">
                            {(isPC ? project.content_PC.pages : project.content_Mobile.pages).map(page => {
                                return page == editingPage ? null : (<button key={page.name} onClick={this.changeEditingPageBtnClickHandler} className="dropdown-item" type="button" pagename={page.name}>{page.title}</button>)
                            })
                            }
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item text-success" type="button">创建页面</button>
                            <button className="dropdown-item text-danger" type="button">删除页面</button>
                        </div>
                    </div>
                </div>
                <div className='d-flex flex-grow-1 flex-shrink-1'>
                    <div className='d-flex flex-grow-0 flex-shrink-0 flex-column'>
                        <button type='button' className='btn btn-sm bg-dark text-light' onClick={this.clickPanelNameBtn} pname='datamaster' ><div>数</div><div>据</div><div>大</div><div>师</div></button>
                        <button type='button' className='btn btn-sm bg-dark text-light' onClick={this.clickPanelNameBtn} ><div>流</div><div>程</div><div>大</div><div>师</div></button>
                        <button type='button' className='btn btn-sm bg-dark text-light' onClick={this.clickPanelNameBtn} ><div>发</div><div>布</div></button>
                    </div>
                    <div onClick={this.clickContentDivHander} className='flex-grow-1 flex-shrink-1 autoScroll d-flex justify-content-center'>
                        {
                            this.renderEditingPage(project, editingPage, isPC)
                        }
                    </div>
                </div>
            </div>
        )
    }
}

function decode64(e) {
    try {
        var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var n = "";
        var r = void 0;
        var o = void 0;
        var a = "";
        var i = void 0;
        var u = void 0;
        var l = "";
        var s = 0;
        if (/[^A-Za-z0-9\+\/\=]/g.exec(e))
            return false;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        do {
            r = t.indexOf(e.charAt(s++)) << 2 | (i = t.indexOf(e.charAt(s++))) >> 4;
            o = (15 & i) << 4 | (u = t.indexOf(e.charAt(s++))) >> 2;
            a = (3 & u) << 6 | (l = t.indexOf(e.charAt(s++)));
            n += String.fromCharCode(r);
            if (64 !== u)
                n += String.fromCharCode(o);
            if (64 !== l)
                n += String.fromCharCode(a);
            r = "";
            o = "";
            a = "";
            i = "";
            u = "";
            l = "";
        } while (s < e.length);
        return unescape(n);
    } catch (e) {
        return false;
    }
}


function convertRate(e) {
    try {
        var t = e.substr(e.length - 4);
        var n = t.charCodeAt(0) + t.charCodeAt(1) + t.charCodeAt(2) + t.charCodeAt(3);
        n = (n = (e.length - 10) % n) > e.length - 10 - 4 ? e.length - 10 - 4 : n;
        var r = e.substr(n, 10);
        e = e.substr(0, n) + e.substr(n + 10);
        var o = decode64(decodeURIComponent(e));
        if (!o)
            return false;
        var a = "";
        var i = 0;
        var u = 0;
        for (i = 0; i < o.length; i += 10) {
            var l = o.charAt(i);
            var s = r.charAt(u % r.length - 1 < 0 ? r.length + u % r.length - 1 : u % r.length - 1);
            a += (l = String.fromCharCode(l.charCodeAt(0) - s.charCodeAt(0))) + o.substring(i + 1, i + 10);
            u++;
        }
        return a
    }
    catch (e) { return !1 }
}

//alert(convertRate('fS44NDYxMDY3gQCGX9rraGOJs0'));
