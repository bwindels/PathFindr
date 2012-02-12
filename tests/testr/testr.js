var Testr = (function() {
    
    var reporter = {
        domContainer: document.getElementById('testr'),
        currentTestContainer: null,
        currentTest: null,
        currentAssertCounter: null,
        testCaseStarted: function(name) {
            var testCaseElement = document.createElement('div');
            testCaseElement.className = 'testCase';
            var title = document.createElement('p');
            title.innerText = name;
            testCaseElement.appendChild(title);
            this.currentTestContainer = document.createElement('ul');
            testCaseElement.appendChild(this.currentTestContainer);
            this.domContainer.appendChild(testCaseElement);
        },
        testStarted: function(name) {
            this.currentTest = document.createElement('li');
            this.currentAssertCounter = document.createElement('div');
            var title = document.createElement('p');
            title.innerText = name;
            this.currentTest.appendChild(this.currentAssertCounter);
            this.currentTest.appendChild(title);
            this.currentTestContainer.appendChild(this.currentTest);
        },
        testFinished: function(success, assertCount, errorDetailList) {
            var assertMsg = assertCount + ' ' + (assertCount === 1 ? 'assert' : 'asserts' );
            this.currentAssertCounter.innerText = assertMsg;
            if(success) {
                this.currentTest.className = 'succeeded';
            } else {
                this.currentTest.className = 'failed';
                var errors = document.createElement('ul');
                errorDetailList.forEach(function(msg) {
                    var errorElement = document.createElement('li');
                    errorElement.innerText = msg;
                    errors.appendChild(errorElement);
                });
                this.currentTest.appendChild(errors);
            }
        },
        noTests: function() {
            var notests = document.createElement('div');
            notests.className = 'notests';
            notests.innerText = 'No tests found, call Testr.test({...}) to define tests';
            this.domContainer.appendChild(notests);
        }
    };
    
    function runTest(o, testName) {
        var messages;
        Testr.assertCount = 0;
        reporter.testStarted(testName);
        try {
            var tmp = {};
            if(o.setup) {
                o.setup(tmp);
            }
            o[testName](tmp);
            if(o.teardown) {
                o.teardown(tmp);
            }
            reporter.testFinished(true, Testr.assertCount);
        } catch(e) {
            if(e.stack) {
                messages = e.stack.split('\n');
            } else {
                messages = [e.message];
            }
            reporter.testFinished(false, Testr.assertCount, messages);
        }
    }
    
    var Testr = {
        testCases: {},
        assertCount: 0,
        test: function(name, o) {
            this.testCases[name] = o;
        },
        run: function() {
            var testCaseNames = Object.keys(this.testCases);
            if(testCaseNames.length === 0) {
                reporter.noTests();
                return;
            }
            testCaseNames.forEach(function(testCaseName) {
                reporter.testCaseStarted(testCaseName);
                var testCase = this.testCases[testCaseName];
                var testNames = Object.keys(testCase).filter(function(testName) {
                    return testName.trim().toLowerCase().indexOf('test') === 0;
                },this);
                testNames.forEach(function(testName) {
                    runTest(testCase, testName);
                },this);
            },this);
        },
        assertTrue: function(val, msg) {
            ++this.assertCount;
            if(!val) {
                throw new Error(msg);
            }
        },
        assertFalse: function(val, msg) {
            ++this.assertCount;
            if(val) {
                throw new Error(msg);
            }
        }
    };
    window.onload = Testr.run.bind(Testr);
    return Testr;
})();