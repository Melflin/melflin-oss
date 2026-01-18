-- Simple AppleScript to move reminder to DELETE CANDIDATE list
on run argv
    set remID to item 1 of argv
    set remTitle to item 2 of argv
    set remList to item 3 of argv
    set backupRef to item 4 of argv
    
    tell application "Reminders"
        -- Create DELETE CANDIDATE list if needed
        try
            set deleteList to list "DELETE CANDIDATE"
        on error
            make new list with properties {name:"DELETE CANDIDATE"}
            set deleteList to list "DELETE CANDIDATE"
        end try
        
        -- Get the reminder
        set rem to reminder id remID
        
        -- Create new reminder in DELETE CANDIDATE list
        make new reminder in deleteList with properties {name:"[🗑️ " & remTitle & "]", body:"Original list: " & remList & ". " & backupRef}
        
        -- Delete the original
        delete rem
    end tell
end run
