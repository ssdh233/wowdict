-- close frame by esc
tinsert(UISpecialFrames, DictFrame:GetName())
tinsert(UISpecialFrames, DictLogFrame:GetName())

function LookUp(msg, shouldLog)
  if (DictLog == nil) then
    DictLog = {}
  end

  if ( DictSourceEN1[msg] or DictSourceEN2[msg] or DictSourceCN1[msg] or DictSourceCN2[msg] ) then
    if shouldLog then 
      AddToDictLog(msg)
    end

    DictScrollFrame:SetVerticalScroll(0);
    DictFrameWord:SetText(msg);

    if (DictSourceEN1[msg]) then
      DictFramePronounciationEN:SetText(DictSourceEN1[msg]["pron"]);
      DictFrameDefinitionEN:SetText(DictSourceEN1[msg]["def"]);
    elseif (DictSourceEN2[msg]) then
      DictFramePronounciationEN:SetText(DictSourceEN2[msg]["pron"]);
      DictFrameDefinitionEN:SetText(DictSourceEN2[msg]["def"]);
    else 
      DictFramePronounciationEN:SetText("");
      DictFrameDefinitionEN:SetText("");
    end

    if (DictSourceCN1[msg]) then
      DictFramePronounciationCN:SetText(DictSourceCN1[msg]["pron"]);
      DictFrameDefinitionCN:SetText(DictSourceCN1[msg]["def"].."\n\n");
    elseif (DictSourceCN2[msg]) then
      DictFramePronounciationCN:SetText(DictSourceCN2[msg]["pron"]);
      DictFrameDefinitionCN:SetText(DictSourceCN2[msg]["def"].."\n\n");
    else
      DictFramePronounciationCN:SetText("");
      DictFrameDefinitionCN:SetText("");
    end
    ShowUIPanel(DictFrame)
    ShowUIPanel(DictScrollChildFrame)

    local enPronHeight = DictFramePronounciationEN:GetStringHeight()
    DictFrameDefinitionEN:SetPoint("TOPLEFT", 20, -(enPronHeight + 20))

    local enDefHeight = DictFrameDefinitionEN:GetStringHeight()
    DictFramePronounciationCN:SetPoint("TOPLEFT", 20, -(enPronHeight + 20 + enDefHeight + 100))

    local cnPronHeight = DictFramePronounciationCN:GetStringHeight()
    DictFrameDefinitionCN:SetPoint("TOPLEFT", 20, -(enPronHeight + 20 + enDefHeight + 100 + cnPronHeight + 20))
  end
end

SLASH_LOOKUP1 = "/d"
SLASH_LOOKUP2 = "/dict"
SlashCmdList["LOOKUP"] = function(msg)
  LookUp(msg, true)
end 

function AddToDictLog(msg)
  local currentDate = date("%Y%m%d%H%M%S")
  local currentLog = nil;
  for k, v in ipairs(DictLog) do
    if (v and v[1] == msg) then
      currentLog = v;
      DictLog[k] = false;
      break
    end
  end
  if currentLog then
    table.insert(DictLog, { msg, currentLog[2] + 1, currentDate })
  else
    table.insert(DictLog, { msg, 1, currentDate })
  end
end

-- SLASH_DICTEXPORT1 = "/dictexport"
-- SlashCmdList["DICTEXPORT"] = function(msg)
--   print("Log:")
--   -- print(table.concat(DictLog,", "))
--   ShowUIPanel(DictExportFrame)

--   -- DictExportEditBox:SetText(table.concat(DictLog,", "))
--   DictExportEditBox:HighlightText()

--   print("DictExportEditBox:", DictExportEditBox)
-- end