using System;
using System.Windows.Forms;
using System.Runtime.InteropServices;
using System.Diagnostics;
using System.IO;
using System.Threading;
using Microsoft.Win32;
using System.Linq;
using System.Security.Principal;

namespace lockdown_example
{
    public partial class Main : Form
    {
        public Main()
        {
            InitializeComponent();
        }

        [DllImport("advapi32.dll", SetLastError = true)]
        private static extern bool OpenProcessToken(IntPtr ProcessHandle, uint DesiredAccess, out IntPtr TokenHandle);
        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool CloseHandle(IntPtr hObject);

        private static string GetProcessUser(Process process)
        {
            IntPtr processHandle = IntPtr.Zero;
            try
            {
                OpenProcessToken(process.Handle, 8, out processHandle);
                WindowsIdentity wi = new WindowsIdentity(processHandle);
                string user = wi.Name;
                return user.Contains(@"\") ? user.Substring(user.IndexOf(@"\") + 1) : user;
            }
            catch
            {
                return null;
            }
            finally
            {
                if (processHandle != IntPtr.Zero)
                {
                    CloseHandle(processHandle);
                }
            }
        }

        private void killProcesses()
        {
            string[] noTerm = { "SearchProtocolHost", "dllhost", "SearchIndexer", "fontdrvhost", "SearchFilterHost", "ctfmon", "smartscreen", "csrss",
                "winlogon", "MsMpEng", "lsass", "svchost", "sihost", "dwm", "RuntimeBroker", "conhost" };

            foreach (Process p in Process.GetProcesses())
            {
                // Check if user process, not in noTerm, not itself
                //if (noTerm.Contains(p.ProcessName) == false)
                if (GetProcessUser(p) == Environment.UserName && noTerm.Contains(p.ProcessName) == false && p.Id != Process.GetCurrentProcess().Id)
                {
                    try
                    {
                        p.Kill();
                    }
                    catch (Exception)
                    {
                        //Console.WriteLine(ex);
                    }
                }
            }
        }


        private void startExplorer()
        {
            Process proc = new Process();
            proc.StartInfo.WindowStyle = ProcessWindowStyle.Hidden;
            proc.StartInfo.FileName = Path.Combine(Environment.GetEnvironmentVariable("windir"), "explorer.exe");
            proc.StartInfo.UseShellExecute = false;
            proc.StartInfo.RedirectStandardOutput = true;
            proc.Start();
        }

        private bool inlockdown = false;

        private void toggleLockdownBtn_Click(object sender, EventArgs e)
        {
            if (inlockdown == false)
            {
                inlockdown = true;
                toggleLockdownBtn.Text = "Unlock System";
                Thread thread = new Thread(procKillThread);
                thread.Start();

                this.WindowState = FormWindowState.Maximized;
                this.FormBorderStyle = FormBorderStyle.None;
                this.TopMost = true;
                WinApi.SetWinFullScreen(this.Handle); // comment this out for small window on unlock
                
            } 
            else
            {
                inlockdown = false;
                toggleLockdownBtn.Text = "Lockdown System";
                startExplorer();

                this.WindowState = FormWindowState.Normal;
                this.FormBorderStyle = FormBorderStyle.FixedSingle;
                this.TopMost = false;
            }

        }

        private void procKillThread()
        {
            // Make windows not open explorer.exe after termination
            // Change to 1 to enable again
            RegistryKey localMachine = RegistryKey.OpenBaseKey(RegistryHive.LocalMachine, RegistryView.Registry64); // 64 bit registry
            localMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon", true).SetValue("AutoRestartShell", 0, RegistryValueKind.DWord);
            // maybe add if 32 bit system?

            while (inlockdown == true)
            {
                killProcesses();
                Thread.Sleep(1000);
            }
        }

        // Alt+f4
        private void Main_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (inlockdown == true)
            {
                e.Cancel = (e.CloseReason == CloseReason.UserClosing);
            }
        }
    }

    public class WinApi
    {
        [DllImport("user32.dll", EntryPoint = "GetSystemMetrics")]
        public static extern int GetSystemMetrics(int which);

        [DllImport("user32.dll")]
        public static extern void
            SetWindowPos(IntPtr hwnd, IntPtr hwndInsertAfter,
                         int X, int Y, int width, int height, uint flags);

        private const int SM_CXSCREEN = 0;
        private const int SM_CYSCREEN = 1;
        private static IntPtr HWND_TOP = IntPtr.Zero;
        private const int SWP_SHOWWINDOW = 64; // 0×0040

        public static int ScreenX
        {
            get { return GetSystemMetrics(SM_CXSCREEN); }
        }

        public static int ScreenY
        {
            get { return GetSystemMetrics(SM_CYSCREEN); }
        }

        public static void SetWinFullScreen(IntPtr hwnd)
        {
            SetWindowPos(hwnd, HWND_TOP, 0, 0, ScreenX, ScreenY, SWP_SHOWWINDOW);
        }
    }
}