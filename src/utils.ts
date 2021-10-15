// startupScript.js:
// const ifr = document.createElement('iframe');
// const __IS_DEBUGGING__ = window.top.location.href.includes('isdebug=1');
// ifr.src = __IS_DEBUGGING__ ? 'localhost:3000/VITE_TEST/' : (window as any).Microsoft?.Dynamics.NAV.GetImageResource('ExtCode/MyAddIn/dist/index.html') ?? '';
// document.getElementById('controlAddIn').appendChild(ifr);

const w = window as any; // Note: w needs to be the startupScript.js's window:
w._BCData = w._BCData || {}; // Stores "return value/s" from AL

// Promisified InvokeExtensibilityMethod:
export const getDataFromAL = (type: string, payload?: Object) => new Promise<Object>(async (res) => {
    // Simple wait-logic, the POS has an array of requests and conditions it checks before sending the next ones
    await waitUntil(() => !w.SetJSResponse); // queue requests so they don't owerwrite previous request (need to clean up when done)

    const s = Symbol('js2al');
    // console.log(s, Object.keys(w._BCData).length, w._BCData[s]);
    w._BCData[s] = [];

    // AL calls JS while reacting to InvokeExtensibilityMethod: CurrPage.CtrlAddin.SetJSReponse(jObj);
    w.SetJSResponse = (jObj: Object) => {
        w._BCData[s].push(jObj);
    }

    // JS calls AL (AL can send response data to JS while processing) 
    w.Microsoft.Dynamics.NAV.InvokeExtensibilityMethod(
        'JS2AL',
        [{
            type,
            payload
        }],
        false,
        () => {
            const responseData = w._BCData[s];
            delete w._BCData[s];
            delete w.SetJSResponse; // allow next event to be parsed (skipIfBusy should handle this in BC)
            res(responseData);
        }
    )
});

export const wait = async (s = 0) => new Promise(res => {
    setTimeout(() => {
        res(undefined);
    }, s);
});

export const waitUntil = async (conditionFn: (...args: any) => Promise<any> | boolean, cntMax = 20) => {
    const interval = 1000;
    let cnt = 0;
    let L = await conditionFn();
    while(!L && cnt < cntMax) {
      await wait(interval);
      L = await conditionFn();
      cnt++;
    }
    if(cnt >= cntMax)
      throw(new Error(`Timeout: ${cntMax * interval}`));
    return L;
};

export const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // [ min ... max [
}