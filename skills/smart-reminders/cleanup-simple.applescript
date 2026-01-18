-- Keep only 1 REST and 1 Ipad in DELETE CANDIDATE list
tell application "Reminders"
    set deleteList to list "DELETE CANDIDATE"
    set allReminders to every reminder in deleteList
    
    -- Track which titles we've seen
    set keptCount to 0
    set deletedCount to 0
    
    repeat with rem in allReminders
        set remName to name of rem
        if remName contains "[🗑️ REST]" then
            if keptCount < 2 then
                set keptCount to keptCount + 1
            else
                delete rem
                set deletedCount to deletedCount + 1
            end if
        end if
    end repeat
    
    -- Reset and do same for Ipad
    set keptCount to 0
    set allReminders to every reminder in deleteList
    
    repeat with rem in allReminders
        set remName to name of rem
        if remName contains "[🗑️ Ipad]" then
            if keptCount < 2 then
                set keptCount to keptCount + 1
            else
                delete rem
                set deletedCount to deletedCount + 1
            end if
        end if
    end repeat
    
    return "Kept 2, Deleted " & deletedCount
end tell
