using System;
using System.Diagnostics;
using System.Windows.Forms;
using injector;

namespace digic
{
    public partial class main : Form
    {
        public main()
        {
            InitializeComponent();
        }

        private void setStatus(string status)
        {
            statusLbl.Text = $"Status: {status}";
        }

        private void InjectDLL(string _proc, string _dll)
        {
            switch (DLLInjection.DllInjector.GetInstance.Inject(_proc, _dll))
            {
                case DLLInjection.DllInjectionResult.DllNotFound:
                    setStatus("Dll not found");
                    MessageBox.Show("Couldn't find the dll!", "Error: Dll Not Found", MessageBoxButtons.OK, MessageBoxIcon.Hand);
                    break;
                case DLLInjection.DllInjectionResult.GameProcessNotFound:
                    setStatus("Application is not running");
                    MessageBox.Show("Process does not exist", "Apllication Process Not Found", MessageBoxButtons.OK, MessageBoxIcon.Hand);
                    break;
                case DLLInjection.DllInjectionResult.InjectionFailed:
                    setStatus("Injection failed");
                    MessageBox.Show("Injection failed! :(", "Injection Failed", MessageBoxButtons.OK, MessageBoxIcon.Hand);
                    break;
                case DLLInjection.DllInjectionResult.Success:
                    setStatus("Success");
                    break;
            }
        }

        private void injectBtn_Click(object sender, EventArgs e)
        {
            string process = (digiexamRBtn.Checked == true ? "DigiExam" : "lockdown-example");
            InjectDLL(process, Application.StartupPath + "\\digic-dll.dll"); // Application.StartupPath is needed
        }

        private void topmostCBox_CheckedChanged(object sender, EventArgs e)
        {
            if (topmostCBox.Checked == true)
            {
                this.TopMost = true;
            }
            else
            {
                this.TopMost = false;
            }
        }

        private void main_Load(object sender, EventArgs e)
        {
            //Adds psexec to path so it can be executed by the dll
            var name = "PATH";
            var scope = EnvironmentVariableTarget.Machine; // or User
            var oldValue = Environment.GetEnvironmentVariable(name, scope);
            var newValue = oldValue + $";{Application.StartupPath}\\bin";
            Environment.SetEnvironmentVariable(name, newValue, scope);
        }
    }
}
