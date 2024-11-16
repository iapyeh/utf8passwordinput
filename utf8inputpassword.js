/*
By: Hsin Yuan Yeh
Using a text-input HTML element to mimic password-input.
Please see demo.html for usage.
Version: v2
Date: 2024/11/16
Project URL: https://github.com/iapyeh/utf8passwordinput
*/

class Utf8PasswordInput{
    
    static counter = 0
    /**
     * constructor for creating a password input element with utf8 support.
     * @param {Element} syncedEle the password element to be replaced
     * @param {Boolean} syncInitialValue whether to get initial value from syncedEle element
     * 
     * when syncInitialValue is true, trying to get initial value from syncedEle element.
     * (usually true for login, fale for changing password)
     */
    constructor(syncedEle,syncInitialValue){        
        Utf8PasswordInput.counter += 1
        this.syncedEle = syncedEle
        //const rect = this.syncedEle.getBoundingClientRect()
        const style = this.syncedEle.currentStyle || window.getComputedStyle(this.syncedEle);
        // when syncInitialValue is true, trying to get initial value from syncedEle element.
        // (usually true for login, fale for changing password)
        this.syncInitialValue = typeof(syncInitialValue)=='undefined' ? true : syncInitialValue
        this.pwd = []
        this.see = false
        this.star = '*'
        // create a replacement element for syncedEle for user to input password
        this.inputEle = this.syncedEle.cloneNode(true)
        this.inputEle.classList.add('utf8passwordinput')
        this.inputEle.setAttribute('type','text')
        this.inputEle.setAttribute('id',`_utf8pwd_${Utf8PasswordInput.counter}`)
        this.inputEle.removeAttribute('name')
        // insert the replacement element after the synced element
        this.syncedEle.parentNode.insertBefore(this.inputEle,this.syncedEle.nextSibling)
        // create the "see" icon
        this.seeEle = document.createElement('span')
        this.seeEle.classList.add('utf8passwordinput')
        this.seeEle.classList.add('see')
        this.seeEle.innerText = '👁'
        // insert the see element at the end
        this.syncedEle.parentNode.insertBefore(this.seeEle,this.inputEle.nextSibling)
        // adjuset see element to be aligned at the right side
        const seeRect = this.seeEle.getBoundingClientRect()
        const marginLeft = '-'+(1+seeRect.width + parseInt(style.marginRight) + parseInt(style.paddingRight))+'px'
        this.seeEle.setAttribute('style',`cursor:pointer;margin-left:${marginLeft}`)
        // minimize the synced element
        this.syncedEle.style.height = '0px'
        this.syncedEle.style.width = '0px'
        this.syncedEle.style.position = 'absolute';
        this.syncedEle.style.top = -1000;

        const self = this
        // flag to stop getting initial value from syncedEle
        this.userInputingStarted = false
        // let syncedEle's value is always updated
        this.inputEle.addEventListener('update', (evt)=>{
            if ((!self.userInputingStarted) && evt.detail.length) {
                self.userInputingStarted = true
            }
            self.syncedEle.value = evt.detail
        })
        this.init()
    }
    
    /**
     * Initializes the Utf8PasswordInput instance by setting up event listeners,
     * syncing initial values if necessary, and configuring the password input
     * behavior. It attempts to restore the initial password from the synced
     * element if `syncInitialValue` is true. Listeners are attached to handle
     * input events, manage character insertion and deletion, and control password
     * visibility toggling.
     */
    init(){
        const self = this
        const setInitialValueFromSyncedEle=(timeout)=>{
            // ele is the password element which browser's password manager would restore password to
            if (!timeout) timeout = 30 * 1000 // try at most 30 seconds
            const start = new Date().getTime()
            const checkpwd = ()=>{
                if (self.userInputingStarted){
                    // stop getting value when user is starting to input
                    return 
                }else if ((new Date().getTime() - start) > timeout){
                    console.warn(`failed to restore password from element ${self.syncedEle.outerHTML}`)
                    return;
                }
                try{
                  if (self.value == ''){
                    if (self.syncedEle.value == ''){
                      setTimeout(checkpwd,100)
                    }else{
                      self.value = self.syncedEle.value
                      self.syncedEle.style.display = 'none'
                    }
                  }
                }catch(e){
                  console.error(e)
                  setTimeout(checkpwd,100)
                }
              }
            checkpwd()        
        }        
        if (this.syncInitialValue) setInitialValueFromSyncedEle()
        
        // hooking up listeners
        const inputEle = this.inputEle
        const seeEle = this.seeEle
        const fireUpdateEvent = ()=>{
            inputEle.dispatchEvent(new CustomEvent('update',{detail:self.value}))
        }
        //hooking event listeners for "input" element
        inputEle.addEventListener('beforeinput',(evt)=>{
            // selectionEnd 此時才準，到input event時已經不是真的值
            let s = evt.target.selectionStart;
            let e;
            if (evt.inputType == 'insertCompositionText'){
                // skip, handle ckj input in "compositionend" event
                return 
            }else if (evt.inputType=='insertText'){
                self._pos = evt.target.selectionEnd
                e = evt.target.selectionEnd
            }else if (evt.inputType=='deleteContentBackward'){
                // <- del
                self._pos = evt.target.selectionEnd
                e = evt.target.selectionEnd
                if (s==e) s = Math.max(0,s-self._starLen)
            }else if (evt.inputType == 'deleteContentForward'){
                // del ->
                self._pos = evt.target.selectionEnd
                e = evt.target.selectionEnd
                if (s==e) e += self._starLen
            }else if (evt.inputType == 'insertFromPaste'){
                self._pos = evt.target.selectionEnd
                e = evt.target.selectionEnd
            }else if (evt.inputType == 'compositionend'){
                //this case might not happen
                self._pos = evt.target.selectionEnd
                e = evt.target.selectionEnd
            }else{
                console.log('???'+evt.inputType)
                e = s
            }
            if (s != e){

                const idx0 = s/self._starLen
                const idx1 = e/self._starLen
                const delLength = idx1 - idx0
                self.pwd.splice(idx0,delLength)
                self._pos = s
            }
        })
        inputEle.addEventListener('input', (evt)=>{
            if (self.see) return
            let pos,inserted,idx
            if (evt.inputType=='insertText'){
                pos = evt.target.selectionStart - evt.data.length
                idx = pos/self._starLen
                for(const char of evt.data){
                    self.pwd.splice(idx,0,char)
                    idx += 1
                }
                const extraOffset = (evt.data.length * self._starLen) - evt.data.length
                self.resetInputEleValue(extraOffset) 
                fireUpdateEvent()    
            }else if (evt.inputType=='deleteContentBackward'){
                self.resetInputEleValue() 
                fireUpdateEvent()
            }else if (evt.inputType=='deleteContentForward'){
                self.resetInputEleValue() 
                fireUpdateEvent()
            }else if (evt.inputType == 'insertFromPaste'){
                //unicodes inserted by paste, such as "😀"
                idx = self._pos/self._starLen
                inserted = evt.data //inputEle.value.substring(self._pos,evt.target.selectionStart)
                let i = 0
                for(const char of inserted){
                    self.pwd.splice(idx+i,0,char)
                    i += 1
                }
                // help the cursor to posite correclty at the end of inserted text when self._starLen > 1 (eg.😀)
                const extraOffset = (i * self._starLen) - inserted.length
                self.resetInputEleValue(extraOffset)
                fireUpdateEvent()
            }else{
                // eg. historyUndo, insertCompositionText
            }
        })
        inputEle.addEventListener('compositionstart', (evt)=>{
            if (self.see) return
            // delete selected text
            const s = evt.target.selectionStart
            const e = evt.target.selectionEnd
            if (s != e){
                const idx0 = s/self._starLen
                const idx1 = e/self._starLen
                const delLength = idx1 - idx0
                self.pwd.splice(idx0,delLength)
            }
        })
        inputEle.addEventListener('compositionend', (evt)=>{
            //CKY chareactors are inputed 
            if (self.see) return
                                    
            let idx = (evt.target.selectionStart - evt.data.length)/self._starLen
            let i = 0
            for(const char of evt.data){
                self.pwd.splice(idx + i,0,char)
                i += 1
            }
            const extraOffset = (i * self._starLen) - evt.data.length
            
            self.resetInputEleValue(extraOffset)
            fireUpdateEvent()
        })
        // hooking event listeners for "see" element
        if (seeEle){
            const showPassword = (evt)=>{
                if (self.see) return //avoid double invoking by events
                self.see = true
                self._pos = inputEle.selectionStart
                inputEle.value = self.getpwd(self.see)
            }
            const hidePassword =  (evt)=>{
                if (!self.see) return //avoid double invoking by events
                self.value = inputEle.value
                self.see = false
                inputEle.value = self.getpwd(self.see)
                inputEle.focus()
                inputEle.selectionStart = self._pos
                inputEle.selectionEnd = self._pos
            }
            seeEle.addEventListener('pointerdown', showPassword)
            seeEle.addEventListener('pointerup',hidePassword)
        }
    }
    /**
     * property to get the value of the password input.
     * @type {String}
     */
    get value(){
        return this.getpwd(true)
    }
    /**
     * Sets the password value for the input element.
     * This function updates the internal password array with the provided value,
     * resetting any existing password, and then fires an update event to notify
     * listeners of the change.
     * 
     * @param {string} v - The new password value to be set.
     */
    set value(v){
        this.pwd = []
        for (let i=0;i<v.length;i++){
            this.pwd.push(v.substr(i,1))
        }
        //fire update event
        this.resetInputEleValue(v.length)
        this.inputEle.dispatchEvent(new CustomEvent('update',{detail:this.value}))
    }
    /**
     * Returns the length of the string in bytes.
     * @param {string} [v] - The string to calculate the length of. If not provided, use the current value of the password input.
     * @returns {number} - The length of the string in bytes.
     */
    getBytesLength(v){
        // REF: https://stackoverflow.com/questions/5515869/string-length-in-bytes-in-javascript
        if (typeof(v)=='undefined') v = this.value
        else if (!typeof(v)=='string') {
            console.warn('getBytesLength() called with non-string '+v)
            return null
        }
        let m = encodeURIComponent(v).match(/%[89ABab]/g);
        return v.length + (m ? m.length : 0);
    }
    /**
     * The length of the password string in bytes.
     * This property is a shortcut of calling `getBytesLength()` without arguments.
     * @type {number}
     */
    get length(){
        return this.getBytesLength()
    }
    /**
     * The character to be used to replace the password string when the user chooses to not see the password.
     * @type {string}
     */
    get star(){
        return this._star
    }
    /**
     * Sets the character to be used to replace the password string when the user chooses to not see the password.
     * @param {string} c - The character to be used to replace the password string.
     * @type {string}
     */
    set star(c){
        this._star = c
        this._starLen = c.length
    }
    
    /**
     * Attach an event listener to the input element of the password input.
     * This is just a shortcut of calling `addEventListener()` on the input element.
     * @param {string} name - The name of the event to listen for.
     * @param {function} callback - The function to call when the event is triggered.
     * @returns {EventTarget} - The input element, so you can chain the calls.
     */
    on(name,callback){
        return this.inputEle.addEventListener(name,callback)
    }

    resetInputEleValue (extraOffset) {
        const pos = this.inputEle.selectionStart + (extraOffset || 0)
        this.inputEle.value = this.getpwd(this.see)
        // reposition the cursor
        this.inputEle.selectionStart = pos
        this.inputEle.selectionEnd = pos          
    }    
    getpwd(plain){
        let chars = []
        const self = this
        this.pwd.map((c)=>{
            if (plain){
                chars.push(c)
            }else{
                chars.push(self.star)
            }
        })
        return chars.join('')
    }
    // since input element can not receive "reset" event, we have to hook on form's resetevent
    // eg. document.myform.addEventListener('reset',()=>{utf8PwdInstance.reset()})
    reset(){
        this.value = ''
    }
}
