#define _CRT_SECURE_NO_DEPRICATE
#define _CRT_SECURE_NO_WARNINGS
#include <Windows.h>
#include <iostream>
#include <fstream>
#include <streambuf>

using namespace std;

HWND parentWindow;
BOOL CALLBACK enumWindowCallback(HWND hwnd, LPARAM lParam)
{
	int length = GetWindowTextLength(hwnd);
	char* buffer = new char[length + 1];
	GetWindowText(hwnd, buffer, length + 1);
	std::string windowTitle(buffer);

	DWORD lpdwProcessId;
	GetWindowThreadProcessId(hwnd, &lpdwProcessId);

	//cout << ">> " << lpdwProcessId << " | " << GetWindowThreadProcessId(hwnd, NULL) << ":  " << windowTitle << endl;
	if (lpdwProcessId == lParam && IsWindowVisible(hwnd) && length != 0 
		&& GetWindowThreadProcessId(GetConsoleWindow(), NULL) != GetWindowThreadProcessId(hwnd, NULL))
	{
		parentWindow = hwnd;
		cout << "Found WINDOW:" << endl 
			<< lpdwProcessId << " | "<< GetWindowThreadProcessId(hwnd, NULL) << ":  " << windowTitle << endl;
	}
	return TRUE;
}

void printHelp()
{
	const char* shortcut = "CTRL+ALT";
	printf(
		"\n\n"
		"Help: \n"
		"%s+H: Show This Help \n"
		"%s+R: Regenerate Window Handles \n"
		"%s+U: Start A Webbrowser \n"
		"%s+N: Open Notes In 'C:\\notes\\notes.txt' \n"
		"%s+O: Show The Parent Window \n"
		"%s+L: Hide The Parent Window \n"
		"%s+F: Toggle Fullscreen (Beta)\n"
		, shortcut, shortcut, shortcut
		, shortcut, shortcut, shortcut,
		shortcut
	);
}

void info(const char* action, int code = 0)
{
	const char* result = (code > -1) ? " SUCCESS" : " FAILURE";
	cout << endl << "[action] "<< action << result << endl;
	Sleep(200);
}

void cerror(const char* err)
{
	cout << endl << "[ERROR] " << err << endl;
}

void enumWindowsRun()
{
	cout << endl << "Iterating WINDOWS..." << endl;
	EnumWindows(enumWindowCallback, GetCurrentProcessId());
	
	int code = 0;
	if (!parentWindow)
	{
		cerror("No WINDOW Found. Restart The application.");
		code = -1;
	}
	info("Get Window Handles (HWNDS)", code);
}

void noTopMost()
{
	cout << endl << "Removing Topmost From Parent WINDOW..." << endl;
	SetWindowPos(parentWindow, HWND_NOTOPMOST, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE); // two last maybe not needed?
}

bool getKeymap(char character)
{
	return GetKeyState(VK_CONTROL) & GetKeyState(VK_MENU) & GetKeyState(character) & 0x8000;
}

BOOL IsWindowMode = false;
void FullScreenSwitch(HWND HWNDWindow)
{
	WINDOWPLACEMENT wpc;
	LONG HWNDStyle = 0;
	LONG HWNDStyleEx = 0;
	if (IsWindowMode)
	{
		IsWindowMode = FALSE;
		GetWindowPlacement(HWNDWindow, &wpc);
		if (HWNDStyle == 0)
			HWNDStyle = GetWindowLong(HWNDWindow, GWL_STYLE);
		if (HWNDStyleEx == 0)
			HWNDStyleEx = GetWindowLong(HWNDWindow, GWL_EXSTYLE);

		LONG NewHWNDStyle = HWNDStyle;
		NewHWNDStyle &= ~WS_BORDER;
		NewHWNDStyle &= ~WS_DLGFRAME;
		NewHWNDStyle &= ~WS_THICKFRAME;

		LONG NewHWNDStyleEx = HWNDStyleEx;
		NewHWNDStyleEx &= ~WS_EX_WINDOWEDGE;

		SetWindowLong(HWNDWindow, GWL_STYLE, NewHWNDStyle | WS_POPUP);
		SetWindowLong(HWNDWindow, GWL_EXSTYLE, NewHWNDStyleEx | WS_EX_TOPMOST);
		ShowWindow(HWNDWindow, SW_SHOWMAXIMIZED);
	}
	else
	{
		IsWindowMode = TRUE;
		SetWindowLong(HWNDWindow, GWL_STYLE, HWNDStyle);
		SetWindowLong(HWNDWindow, GWL_EXSTYLE, HWNDStyleEx);
		ShowWindow(HWNDWindow, SW_SHOWNORMAL);
		SetWindowPlacement(HWNDWindow, &wpc);
	}
}

int main() {
	AllocConsole();
	SetConsoleTitleA("DigicDll");
	(void)freopen("CONOUT$", "w", stdout);
	(void)freopen("CONIN$", "r", stdin);
	
	HWND ConsoleHandle = GetConsoleWindow();
	SetWindowPos(ConsoleHandle, HWND_TOPMOST, 0, 0, 0, 0, SWP_DRAWFRAME | SWP_NOMOVE | SWP_NOSIZE | SWP_SHOWWINDOW);
	ShowWindow(ConsoleHandle, SW_NORMAL);

	printf(
		" _______   __    _______  __    ______  \n"
		"|       \\ |  |  /  _____||  |  /      | \n"
		"|  .--.  ||  | |  |  __  |  | |  ,----' \n"
		"|  |  |  ||  | |  | |_ | |  | |  |      \n"
		"|  '--'  ||  | |  |__| | |  | |  `----. \n"
		"|_______/ |__|  \\______| |__|  \\______| \n"
	);
	
	printf(
		"Welcome To Digic \n"
		"This application allows you to do stuff when your computer is in lockdown. \n"
		"Usage is simple: \n"
		"Inject it into the lockdown software with digic.exe before it locked your computer down. \n"
		"When your computer is in lockdown you can do stuff with the keybinds bellow: \n"
	);

	printHelp();

	//TCHAR windir[MAX_PATH];
	//(void)GetWindowsDirectory(windir, MAX_PATH);
	//string startExplorer = string("start ") + windir + "\\explorer.exe";

	// Put window into enumwindows
	enumWindowsRun();
	
	while (true) {
		if (getKeymap('H')) // Help
		{
			printHelp();
			Sleep(200);
		}
		else if (getKeymap('C'))
		{
			system("psexec -i -s cmd.exe /c start cmd.exe");
			info("Start Cmd");
		}
		else if (getKeymap('R')) // New enumwindows
		{
			enumWindowsRun();
		}
		else if (getKeymap('U')) // Open browser
		{
			noTopMost();
			system("psexec -i -s cmd.exe /c start \"\" \"https://www.google.com/\"");

			info("Start Browser");
		}
		else if (getKeymap('N')) // Open notes
		{
			int code = 0;
			
			noTopMost();

			ifstream file("C:\\notes\\notes.txt");
			if (file.is_open())
			{
				string notes((istreambuf_iterator<char>(file)),
					istreambuf_iterator<char>());

				cout << endl << "File Contents:" << endl
					<< notes << endl;
			}
			else
			{
				cerror("File Doesn't Exist 'C:\\notes\\notes.txt'.");
				code = -1;
			}

			system("psexec -i -s cmd.exe /c start notepad.exe \"C:\\notes\\notes.txt\"");
			
			info("Show Notes", code);
		}
		else if (getKeymap('O')) // Show window
		{
			ShowWindow(parentWindow, SW_SHOW);
			info("Show Window");
		}
		else if (getKeymap('L')) // Hide window
		{
			ShowWindow(parentWindow, SW_HIDE);
			info("Hide Window");
		}
		else if (getKeymap('F')) // Hide window
		{
			FullScreenSwitch(parentWindow);
			info("Toggle Fullscreen");
		}
	}
}

BOOL __stdcall DllMain(HINSTANCE Dll, DWORD Reason, LPVOID Reserved) {
	if (Reason == DLL_PROCESS_ATTACH) {
		CreateThread(0, 0, (LPTHREAD_START_ROUTINE)main, 0, 0, 0);
	}
	return TRUE;
}