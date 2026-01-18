-- Cleanup DELETE CANDIDATE list - keep only newest of each type
tell application "Reminders"
    set deleteList to list "DELETE CANDIDATE"
    set remindersToDelete to {}
    
    -- Find duplicates of [🗑️ REST]
    set restReminders to every reminder in deleteList whose name contains "[🗑️ REST]"
    if (count of restReminders) > 1 then
        repeat with i from 2 to (count of restReminders)
            set end of remindersToDelete to item i of restReminders
        end repeat
    end if
    
    -- Find duplicates of [🗑️ Ipad]
    set ipadReminders to every reminder in deleteList whose name contains "[🗑️ Ipad]"
    if (count of ipadReminders) > 1 then
        repeat with i from 2 to (count of ipadReminders)
            set end of remindersToDelete to item i of ipadReminders
        end repeat
    end if
    
    -- Delete duplicates
    repeat with rem in remindersToDelete
        delete rem
    end repeat
    
    return count of reminders in deleteList
end tell
