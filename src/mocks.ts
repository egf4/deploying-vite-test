import { wait, getRandomInt } from "./utils";

const w = window as any; // Note: w needs to be the startupScript.js's window:

w.Microsoft = w.Microsoft || { Dynamics: { NAV: {}}}; // Mock

w.Microsoft.Dynamics.NAV.GetEnvironment = w.Microsoft.Dynamics.NAV.GetEnvironment || (() => ({
    Busy: false
}));

// Mocking what AL would do:
w.Microsoft.Dynamics.NAV.InvokeExtensibilityMethod = (methodName: string, args: any, skipIfBusy: boolean, cb: () => void) => {
    w.Microsoft.Dynamics.NAV.GetEnvironment().Busy = true;
    const cbWrapper = () => {
        w.Microsoft.Dynamics.NAV.GetEnvironment().Busy = false;
        cb();
    }
    (async () => {
        if(methodName !== 'JS2AL') {
            console.log('AddIn method name not found');
            cbWrapper();
            return;
        }
        // JS calls AL and it takes 1000 ms to process:
        await wait(1000);
        const arg = args[0];
        if(arg.type !== 'GetCustomers') {
            console.log('JS2AL method type not found');
            cbWrapper();
            return;
        }
        // AL sends some content over to JS:
        w.SetJSResponse([
            {
                name: 'cust ' + (arg.payload.cnt + 1),
                age: getRandomInt(16, 82)
            }
        ]);
        // AL finishes doing execution for 500 ms:
        await wait(500);
        // BC invokes the callback when done:
        cbWrapper();
    })();
}

// You'd need another procedure (preferably) to indicate that 
// AL is invoking something in JS, an example would be a Page Action:
w.AL2JS = (jObj: { type: string, payload: { [k: string]: any } }) => {
    const { type, payload } = jObj;
    switch(type) {
        case 'evaljs':
            payload?.js ? eval(payload.js) : undefined;
            break;
        // case 'reset':
        //     RESET_APP();
        //     break;
        // etc.
        default:
            console.log('Warning - received an unknown AL2JS command');
            break;
    }
}